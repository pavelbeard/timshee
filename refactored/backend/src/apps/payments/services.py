"""
Payment services for managing payment operations.
"""

from decimal import Decimal
from typing import Dict, Any, Optional, List, Type
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
from django.db import models

from .models import Payment, PaymentMethod, PaymentRefund, PaymentIntent, PaymentWebhook
from .gateways import PaymentGateway, PaymentResult
from .gateways.base import CustomerData, PaymentMethodData


class PaymentGatewayService:
    """
    Service for managing payment gateways.
    """
    
    def __init__(self):
        self._gateways: Dict[str, Type[PaymentGateway]] = {}
        self._gateway_configs: Dict[str, Dict[str, Any]] = {}
        self._gateway_instances: Dict[str, PaymentGateway] = {}  # Cache instances
        self._initialize_gateways()
    
    def _initialize_gateways(self):
        """Initialize available payment gateways."""
        # Register mock gateway (always available)
        from .gateways.mock_gateway import MockGateway
        self.register_gateway('mock', MockGateway, {
            'simulate_failures': getattr(settings, 'PAYMENT_MOCK_SIMULATE_FAILURES', False),
            'failure_rate': getattr(settings, 'PAYMENT_MOCK_FAILURE_RATE', 0.1),
            'processing_delay': getattr(settings, 'PAYMENT_MOCK_PROCESSING_DELAY', 0),
        })
        
        # Register Stripe gateway if configured
        stripe_config = getattr(settings, 'STRIPE_CONFIG', {})
        if stripe_config.get('api_key'):
            try:
                from .gateways.stripe_gateway import StripeGateway
                self.register_gateway('stripe', StripeGateway, stripe_config)
            except ImportError:
                pass  # Stripe library not installed
        
        # Register PayPal gateway if configured
        paypal_config = getattr(settings, 'PAYPAL_CONFIG', {})
        if paypal_config.get('client_id') and paypal_config.get('client_secret'):
            try:
                from .gateways.paypal_gateway import PayPalGateway
                self.register_gateway('paypal', PayPalGateway, paypal_config)
            except ImportError:
                pass  # PayPal dependencies not installed
    
    def register_gateway(self, name: str, gateway_class: Type[PaymentGateway], config: Dict[str, Any]):
        """Register a payment gateway."""
        self._gateways[name] = gateway_class
        self._gateway_configs[name] = config
    
    def get_gateway(self, gateway_name: str) -> PaymentGateway:
        """Get a payment gateway instance."""
        if gateway_name not in self._gateways:
            raise ValueError(f"Gateway '{gateway_name}' not found")
        
        # Return cached instance if available
        if gateway_name in self._gateway_instances:
            return self._gateway_instances[gateway_name]
        
        # Create new instance and cache it
        gateway_class = self._gateways[gateway_name]
        gateway_config = self._gateway_configs[gateway_name]
        instance = gateway_class(gateway_config)
        self._gateway_instances[gateway_name] = instance
        return instance
    
    def get_available_gateways(self) -> List[str]:
        """Get list of available payment gateways."""
        return list(self._gateways.keys())
    
    def get_default_gateway(self) -> str:
        """Get the default payment gateway."""
        default = getattr(settings, 'DEFAULT_PAYMENT_GATEWAY', 'mock')
        if default in self._gateways:
            return default
        
        # Fallback to first available gateway
        available = self.get_available_gateways()
        return available[0] if available else 'mock'


class PaymentService:
    """
    Service for managing payments.
    """
    
    def __init__(self):
        self.gateway_service = PaymentGatewayService()
    
    def create_payment_intent(
        self,
        user: User,
        amount: Decimal,
        currency: str = 'USD',
        gateway_name: Optional[str] = None,
        payment_method_id: Optional[int] = None,
        description: Optional[str] = None,
        reference_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        capture_method: str = 'automatic'
    ) -> PaymentIntent:
        """
        Create a payment intent.
        
        Args:
            user: User making the payment
            amount: Payment amount
            currency: Payment currency
            gateway_name: Payment gateway to use (optional)
            payment_method_id: Saved payment method ID (optional)
            description: Payment description
            reference_id: External reference ID
            metadata: Additional metadata
            capture_method: 'automatic' or 'manual'
            
        Returns:
            PaymentIntent instance
        """
        # Get gateway
        gateway_name = gateway_name or self.gateway_service.get_default_gateway()
        gateway = self.gateway_service.get_gateway(gateway_name)
        
        # Get payment method if provided
        payment_method = None
        payment_method_data = None
        if payment_method_id:
            try:
                payment_method = PaymentMethod.objects.get(
                    id=payment_method_id,
                    user=user,
                    is_active=True
                )
                payment_method_data = PaymentMethodData(
                    method_type=payment_method.payment_type,
                    token=payment_method.provider_method_id
                )
            except PaymentMethod.DoesNotExist:
                raise ValueError("Payment method not found")
        
        # Prepare customer data
        customer_data = CustomerData(
            email=user.email,
            name=f"{user.first_name} {user.last_name}".strip() or None,
            metadata={'user_id': user.id}
        )
        
        # Create payment intent in Django
        intent = PaymentIntent.objects.create(
            user=user,
            amount=amount,
            currency=currency,
            gateway=gateway_name,
            description=description or "",
            reference_id=reference_id or "",
            capture_method=capture_method,
            metadata=metadata or {}
        )
        
        # Create intent with gateway
        try:
            result = gateway.create_payment_intent(
                amount=amount,
                currency=currency,
                customer_data=customer_data,
                payment_method_data=payment_method_data,
                description=description,
                metadata={
                    'intent_id': str(intent.intent_id),
                    'reference_id': reference_id,
                    **(metadata or {})
                }
            )
            
            # Update intent with gateway response
            intent.gateway_intent_id = result.transaction_id
            intent.status = self._map_payment_status_to_intent(result.status)
            intent.client_secret = result.gateway_response.get('client_secret') if result.gateway_response else None
            intent.save()
            
            return intent
            
        except Exception as e:
            intent.status = 'requires_payment_method'
            intent.save()
            raise e
    
    def confirm_payment_intent(
        self,
        intent_id: str,
        payment_method_data: Optional[PaymentMethodData] = None
    ) -> PaymentResult:
        """
        Confirm a payment intent.
        
        Args:
            intent_id: Payment intent ID
            payment_method_data: Payment method data if not provided during creation
            
        Returns:
            PaymentResult
        """
        # Get intent
        try:
            intent = PaymentIntent.objects.get(intent_id=intent_id)
        except PaymentIntent.DoesNotExist:
            raise ValueError("Payment intent not found")
        
        # Get gateway
        gateway = self.gateway_service.get_gateway(intent.gateway)
        
        # Confirm payment with gateway
        result = gateway.confirm_payment(
            intent.gateway_intent_id,
            payment_method_data
        )
        
        # Update intent status
        intent.status = self._map_payment_status_to_intent(result.status)
        intent.save()
        
        # Create payment record if successful
        if result.is_successful:
            # Get payment method from intent's payment if it exists
            payment_method = None
            if hasattr(intent, 'payment') and intent.payment:
                payment_method = intent.payment.payment_method
                
            payment = Payment.objects.create(
                user=intent.user,
                payment_method=payment_method,
                amount=intent.amount,
                currency=intent.currency,
                status='completed',
                gateway=intent.gateway,
                gateway_transaction_id=result.transaction_id,
                gateway_response=result.gateway_response or {},
                description=intent.description,
                reference_id=intent.reference_id,
                fee_amount=result.fee_amount or Decimal('0.00'),
                net_amount=intent.amount - (result.fee_amount or Decimal('0.00')),
                captured_at=timezone.now(),
                metadata=intent.metadata
            )
            
            # Link payment to intent
            intent.payment = payment
            intent.save()
        
        return result
    
    def capture_payment(self, payment_id: str, amount: Optional[Decimal] = None) -> PaymentResult:
        """
        Capture a payment (for manual capture).
        
        Args:
            payment_id: Payment ID
            amount: Amount to capture (optional)
            
        Returns:
            PaymentResult
        """
        # Get payment
        try:
            payment = Payment.objects.get(payment_id=payment_id)
        except Payment.DoesNotExist:
            raise ValueError("Payment not found")
        
        # Get gateway
        gateway = self.gateway_service.get_gateway(payment.gateway)
        
        # Capture payment with gateway
        result = gateway.capture_payment(payment.gateway_transaction_id, amount)
        
        # Update payment status
        if result.is_successful:
            payment.status = 'completed'
            payment.captured_at = timezone.now()
            if amount:
                payment.amount = amount
                payment.net_amount = amount - payment.fee_amount
        else:
            payment.status = 'failed'
            payment.failed_at = timezone.now()
            payment.failure_reason = result.error_message
            payment.failure_code = result.error_code
        
        payment.gateway_response.update(result.gateway_response or {})
        payment.save()
        
        return result
    
    def create_refund(
        self,
        payment_id: str,
        amount: Optional[Decimal] = None,
        reason: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> PaymentRefund:
        """
        Create a refund for a payment.
        
        Args:
            payment_id: Payment ID
            amount: Refund amount (optional, refunds full amount if not specified)
            reason: Refund reason
            metadata: Additional metadata
            
        Returns:
            PaymentRefund instance
        """
        # Get payment
        try:
            payment = Payment.objects.get(payment_id=payment_id)
        except Payment.DoesNotExist:
            raise ValueError("Payment not found")
        
        # Validate payment can be refunded
        if not payment.can_be_refunded():
            raise ValueError("Payment cannot be refunded")
        
        # Calculate refund amount
        refund_amount = amount or payment.amount
        
        # Create refund record
        refund = PaymentRefund.objects.create(
            payment=payment,
            amount=refund_amount,
            currency=payment.currency,
            reason=reason,
            metadata=metadata or {}
        )
        
        # Get gateway
        gateway = self.gateway_service.get_gateway(payment.gateway)
        
        # Create refund with gateway
        try:
            result = gateway.create_refund(
                payment.gateway_transaction_id,
                amount=refund_amount,
                reason=reason,
                metadata={'refund_id': str(refund.refund_id)}
            )
            
            # Update refund with gateway response
            refund.gateway_refund_id = result.refund_id
            refund.gateway_response = result.gateway_response or {}
            
            if result.success:
                refund.status = 'completed'
                refund.processed_at = timezone.now()
                
                # Update payment status
                total_refunded = payment.refunds.filter(status='completed').aggregate(
                    total=models.Sum('amount')
                )['total'] or Decimal('0.00')
                
                if total_refunded >= payment.amount:
                    payment.status = 'refunded'
                else:
                    payment.status = 'partially_refunded'
                payment.save()
            else:
                refund.status = 'failed'
                refund.failed_at = timezone.now()
                refund.failure_reason = result.error_message
            
            refund.save()
            return refund
            
        except Exception as e:
            refund.status = 'failed'
            refund.failed_at = timezone.now()
            refund.failure_reason = str(e)
            refund.save()
            raise e
    
    def save_payment_method(
        self,
        user: User,
        payment_method_data: PaymentMethodData,
        gateway_name: Optional[str] = None,
        name: Optional[str] = None,
        is_default: bool = False
    ) -> PaymentMethod:
        """
        Save a payment method for a user.
        
        Args:
            user: User
            payment_method_data: Payment method data
            gateway_name: Payment gateway to use
            name: Display name for the payment method
            is_default: Whether this should be the default payment method
            
        Returns:
            PaymentMethod instance
        """
        # Get gateway
        gateway_name = gateway_name or self.gateway_service.get_default_gateway()
        gateway = self.gateway_service.get_gateway(gateway_name)
        
        # Prepare customer data
        customer_data = CustomerData(
            email=user.email,
            name=f"{user.first_name} {user.last_name}".strip() or None,
            metadata={'user_id': user.id}
        )
        
        # Save payment method with gateway
        gateway_result = gateway.save_payment_method(customer_data, payment_method_data)
        
        # Create payment method record
        payment_method = PaymentMethod.objects.create(
            user=user,
            name=name or self._generate_payment_method_name(payment_method_data, gateway_result),
            payment_type=payment_method_data.method_type,
            provider=gateway_name,
            provider_method_id=gateway_result.get('id') or gateway_result.get('payment_method_id'),
            is_default=is_default,
            metadata=gateway_result
        )
        
        # Set card details if available
        if payment_method_data.method_type == 'card':
            if 'card' in gateway_result:
                card_data = gateway_result['card']
                payment_method.card_last_four = card_data.get('last4')
                payment_method.card_brand = card_data.get('brand')
                payment_method.card_exp_month = card_data.get('exp_month')
                payment_method.card_exp_year = card_data.get('exp_year')
            elif payment_method_data.card_number:
                payment_method.card_last_four = payment_method_data.card_number[-4:]
                payment_method.card_exp_month = payment_method_data.card_exp_month
                payment_method.card_exp_year = payment_method_data.card_exp_year
        
        payment_method.save()
        return payment_method
    
    def process_webhook(
        self,
        gateway_name: str,
        payload: Dict[str, Any],
        headers: Dict[str, str]
    ) -> PaymentWebhook:
        """
        Process a payment webhook.
        
        Args:
            gateway_name: Payment gateway name
            payload: Webhook payload
            headers: HTTP headers
            
        Returns:
            PaymentWebhook instance
        """
        # Get gateway
        gateway = self.gateway_service.get_gateway(gateway_name)
        
        # Process webhook with gateway
        webhook_data = gateway.handle_webhook(payload, headers)
        
        # Create webhook record
        webhook = PaymentWebhook.objects.create(
            gateway=gateway_name,
            event_type=webhook_data.get('type') or webhook_data.get('event_type'),
            gateway_event_id=webhook_data.get('event_id') or webhook_data.get('id'),
            payload=payload,
            headers=headers
        )
        
        # Try to process the webhook
        try:
            self._process_webhook_event(webhook, webhook_data)
            webhook.mark_as_processed()
        except Exception as e:
            webhook.mark_as_failed(str(e))
        
        return webhook
    
    def _process_webhook_event(self, webhook: PaymentWebhook, webhook_data: Dict[str, Any]):
        """Process a specific webhook event."""
        event_type = webhook.event_type
        data = webhook_data.get('data', {})
        
        # Handle different event types
        if 'payment_intent' in event_type:
            self._handle_payment_intent_webhook(event_type, data, webhook)
        elif 'charge' in event_type:
            self._handle_charge_webhook(event_type, data, webhook)
        elif 'refund' in event_type:
            self._handle_refund_webhook(event_type, data, webhook)
    
    def _handle_payment_intent_webhook(self, event_type: str, data: Dict[str, Any], webhook: PaymentWebhook):
        """Handle payment intent webhook events."""
        intent_id = data.get('id')
        if not intent_id:
            return
        
        # Find related payment intent
        try:
            intent = PaymentIntent.objects.get(gateway_intent_id=intent_id)
            webhook.related_payment = intent.payment
            webhook.save()
        except PaymentIntent.DoesNotExist:
            pass
    
    def _handle_charge_webhook(self, event_type: str, data: Dict[str, Any], webhook: PaymentWebhook):
        """Handle charge webhook events."""
        # This would handle charge-specific events
        pass
    
    def _handle_refund_webhook(self, event_type: str, data: Dict[str, Any], webhook: PaymentWebhook):
        """Handle refund webhook events."""
        # This would handle refund-specific events
        pass
    
    def _map_payment_status_to_intent(self, payment_status) -> str:
        """Map payment status to intent status."""
        from .gateways.base import PaymentStatus
        
        status_map = {
            PaymentStatus.PENDING: 'requires_payment_method',
            PaymentStatus.PROCESSING: 'processing',
            PaymentStatus.REQUIRES_ACTION: 'requires_action',
            PaymentStatus.COMPLETED: 'succeeded',
            PaymentStatus.FAILED: 'requires_payment_method',
            PaymentStatus.CANCELLED: 'cancelled',
        }
        return status_map.get(payment_status, 'requires_payment_method')
    
    def _generate_payment_method_name(
        self,
        payment_method_data: PaymentMethodData,
        gateway_result: Dict[str, Any]
    ) -> str:
        """Generate a display name for a payment method."""
        if payment_method_data.method_type == 'card':
            if 'card' in gateway_result:
                card_data = gateway_result['card']
                brand = card_data.get('brand', 'Card').title()
                last4 = card_data.get('last4', '****')
                return f"{brand} •••• {last4}"
            elif payment_method_data.card_number:
                last4 = payment_method_data.card_number[-4:]
                return f"Card •••• {last4}"
        
        return payment_method_data.method_type.replace('_', ' ').title()


# Global service instance
payment_service = PaymentService()
