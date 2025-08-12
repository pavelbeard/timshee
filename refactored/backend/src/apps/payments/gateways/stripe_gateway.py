"""
Stripe payment gateway implementation.
"""

import stripe
from decimal import Decimal
from typing import Dict, Any, Optional, List

from .base import (
    PaymentGateway,
    PaymentResult,
    RefundResult,
    PaymentStatus,
    RefundStatus,
    PaymentMethodData,
    CustomerData,
    PaymentGatewayError
)


class StripeGateway(PaymentGateway):
    """
    Stripe payment gateway implementation.
    
    This gateway integrates with Stripe's API for real payment processing.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize Stripe gateway.
        
        Config should contain:
        - api_key: Stripe secret API key
        - webhook_secret: Stripe webhook endpoint secret
        - public_key: Stripe publishable key (optional)
        """
        super().__init__(config)
        stripe.api_key = config['api_key']
        self.webhook_secret = config.get('webhook_secret')
        self.public_key = config.get('public_key')
    
    def get_gateway_name(self) -> str:
        """Return the gateway name."""
        return "stripe"
    
    def create_payment_intent(
        self,
        amount: Decimal,
        currency: str,
        customer_data: CustomerData,
        payment_method_data: Optional[PaymentMethodData] = None,
        description: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> PaymentResult:
        """Create a Stripe payment intent."""
        try:
            if not self.validate_amount(amount, currency):
                return PaymentResult(
                    success=False,
                    status=PaymentStatus.FAILED,
                    error_message="Invalid payment amount",
                    error_code="invalid_amount"
                )
            
            # Create or get customer
            customer = self._get_or_create_customer(customer_data)
            
            # Prepare intent parameters
            intent_params = {
                'amount': self.format_amount_for_gateway(amount, currency),
                'currency': currency.lower(),
                'customer': customer.id,
                'description': description,
                'metadata': metadata or {},
                'automatic_payment_methods': {'enabled': True},
            }
            
            # Add payment method if provided
            if payment_method_data and payment_method_data.token:
                intent_params['payment_method'] = payment_method_data.token
                intent_params['confirmation_method'] = 'manual'
                intent_params['confirm'] = True
            
            # Create payment intent
            intent = stripe.PaymentIntent.create(**intent_params)
            
            # Determine status
            status = self._map_stripe_status(intent.status)
            
            return PaymentResult(
                success=True,
                status=status,
                transaction_id=intent.id,
                requires_action=intent.status == 'requires_action',
                action_data=intent.next_action if intent.next_action else None,
                gateway_response=intent.to_dict()
            )
            
        except stripe.error.StripeError as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message=str(e),
                error_code=e.code if hasattr(e, 'code') else 'stripe_error',
                gateway_response=e.json_body if hasattr(e, 'json_body') else None
            )
        except Exception as e:
            raise PaymentGatewayError(f"Stripe payment intent creation failed: {str(e)}")
    
    def confirm_payment(
        self,
        intent_id: str,
        payment_method_data: Optional[PaymentMethodData] = None
    ) -> PaymentResult:
        """Confirm a Stripe payment intent."""
        try:
            # Get payment intent
            intent = stripe.PaymentIntent.retrieve(intent_id)
            
            # Prepare confirmation parameters
            confirm_params = {}
            if payment_method_data and payment_method_data.token:
                confirm_params['payment_method'] = payment_method_data.token
            
            # Confirm the intent
            intent = stripe.PaymentIntent.confirm(intent_id, **confirm_params)
            
            # Calculate fee from charges
            fee_amount = None
            if intent.charges.data:
                charge = intent.charges.data[0]
                if charge.balance_transaction:
                    balance_transaction = stripe.BalanceTransaction.retrieve(
                        charge.balance_transaction
                    )
                    fee_amount = self.format_amount_from_gateway(
                        balance_transaction.fee, intent.currency
                    )
            
            return PaymentResult(
                success=True,
                status=self._map_stripe_status(intent.status),
                transaction_id=intent.id,
                requires_action=intent.status == 'requires_action',
                action_data=intent.next_action if intent.next_action else None,
                fee_amount=fee_amount,
                gateway_response=intent.to_dict()
            )
            
        except stripe.error.StripeError as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message=str(e),
                error_code=e.code if hasattr(e, 'code') else 'stripe_error',
                gateway_response=e.json_body if hasattr(e, 'json_body') else None
            )
        except Exception as e:
            raise PaymentGatewayError(f"Stripe payment confirmation failed: {str(e)}")
    
    def capture_payment(self, intent_id: str, amount: Optional[Decimal] = None) -> PaymentResult:
        """Capture a Stripe payment."""
        try:
            # Get payment intent
            intent = stripe.PaymentIntent.retrieve(intent_id)
            
            if intent.status != 'requires_capture':
                return PaymentResult(
                    success=False,
                    status=PaymentStatus.FAILED,
                    error_message="Payment not ready for capture",
                    error_code="invalid_state"
                )
            
            # Prepare capture parameters
            capture_params = {}
            if amount:
                capture_params['amount_to_capture'] = self.format_amount_for_gateway(
                    amount, intent.currency
                )
            
            # Capture the payment
            intent = stripe.PaymentIntent.capture(intent_id, **capture_params)
            
            return PaymentResult(
                success=True,
                status=self._map_stripe_status(intent.status),
                transaction_id=intent.id,
                gateway_response=intent.to_dict()
            )
            
        except stripe.error.StripeError as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message=str(e),
                error_code=e.code if hasattr(e, 'code') else 'stripe_error'
            )
        except Exception as e:
            raise PaymentGatewayError(f"Stripe payment capture failed: {str(e)}")
    
    def cancel_payment(self, intent_id: str) -> PaymentResult:
        """Cancel a Stripe payment intent."""
        try:
            intent = stripe.PaymentIntent.cancel(intent_id)
            
            return PaymentResult(
                success=True,
                status=PaymentStatus.CANCELLED,
                transaction_id=intent.id,
                gateway_response=intent.to_dict()
            )
            
        except stripe.error.StripeError as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message=str(e),
                error_code=e.code if hasattr(e, 'code') else 'stripe_error'
            )
        except Exception as e:
            raise PaymentGatewayError(f"Stripe payment cancellation failed: {str(e)}")
    
    def create_refund(
        self,
        payment_id: str,
        amount: Optional[Decimal] = None,
        reason: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> RefundResult:
        """Create a Stripe refund."""
        try:
            # Get payment intent to find charge
            intent = stripe.PaymentIntent.retrieve(payment_id)
            
            if not intent.charges.data:
                return RefundResult(
                    success=False,
                    status=RefundStatus.FAILED,
                    error_message="No charge found for payment",
                    error_code="no_charge"
                )
            
            charge_id = intent.charges.data[0].id
            
            # Prepare refund parameters
            refund_params = {
                'charge': charge_id,
                'metadata': metadata or {}
            }
            
            if amount:
                refund_params['amount'] = self.format_amount_for_gateway(amount, intent.currency)
            
            if reason:
                # Map reason to Stripe reasons
                stripe_reasons = ['duplicate', 'fraudulent', 'requested_by_customer']
                if reason in stripe_reasons:
                    refund_params['reason'] = reason
                else:
                    refund_params['reason'] = 'requested_by_customer'
            
            # Create refund
            refund = stripe.Refund.create(**refund_params)
            
            return RefundResult(
                success=True,
                status=self._map_stripe_refund_status(refund.status),
                refund_id=refund.id,
                gateway_response=refund.to_dict()
            )
            
        except stripe.error.StripeError as e:
            return RefundResult(
                success=False,
                status=RefundStatus.FAILED,
                error_message=str(e),
                error_code=e.code if hasattr(e, 'code') else 'stripe_error'
            )
        except Exception as e:
            raise PaymentGatewayError(f"Stripe refund creation failed: {str(e)}")
    
    def get_payment_status(self, payment_id: str) -> PaymentResult:
        """Get Stripe payment status."""
        try:
            intent = stripe.PaymentIntent.retrieve(payment_id)
            
            return PaymentResult(
                success=True,
                status=self._map_stripe_status(intent.status),
                transaction_id=intent.id,
                gateway_response=intent.to_dict()
            )
            
        except stripe.error.StripeError as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message=str(e),
                error_code=e.code if hasattr(e, 'code') else 'stripe_error'
            )
        except Exception as e:
            raise PaymentGatewayError(f"Stripe payment status retrieval failed: {str(e)}")
    
    def get_refund_status(self, refund_id: str) -> RefundResult:
        """Get Stripe refund status."""
        try:
            refund = stripe.Refund.retrieve(refund_id)
            
            return RefundResult(
                success=True,
                status=self._map_stripe_refund_status(refund.status),
                refund_id=refund.id,
                gateway_response=refund.to_dict()
            )
            
        except stripe.error.StripeError as e:
            return RefundResult(
                success=False,
                status=RefundStatus.FAILED,
                error_message=str(e),
                error_code=e.code if hasattr(e, 'code') else 'stripe_error'
            )
        except Exception as e:
            raise PaymentGatewayError(f"Stripe refund status retrieval failed: {str(e)}")
    
    def save_payment_method(
        self,
        customer_data: CustomerData,
        payment_method_data: PaymentMethodData
    ) -> Dict[str, Any]:
        """Save a Stripe payment method."""
        try:
            # Get or create customer
            customer = self._get_or_create_customer(customer_data)
            
            # Create payment method
            if payment_method_data.token:
                # Attach existing payment method
                payment_method = stripe.PaymentMethod.attach(
                    payment_method_data.token,
                    customer=customer.id
                )
            else:
                # Create new payment method
                pm_params = {
                    'type': payment_method_data.method_type,
                    'customer': customer.id
                }
                
                if payment_method_data.method_type == 'card':
                    pm_params['card'] = {
                        'number': payment_method_data.card_number,
                        'exp_month': payment_method_data.card_exp_month,
                        'exp_year': payment_method_data.card_exp_year,
                        'cvc': payment_method_data.card_cvc,
                    }
                
                payment_method = stripe.PaymentMethod.create(**pm_params)
            
            return payment_method.to_dict()
            
        except stripe.error.StripeError as e:
            raise PaymentGatewayError(f"Stripe payment method save failed: {str(e)}")
        except Exception as e:
            raise PaymentGatewayError(f"Stripe payment method save failed: {str(e)}")
    
    def delete_payment_method(self, payment_method_id: str) -> bool:
        """Delete a Stripe payment method."""
        try:
            stripe.PaymentMethod.detach(payment_method_id)
            return True
        except stripe.error.StripeError:
            return False
        except Exception:
            return False
    
    def list_payment_methods(self, customer_id: str) -> List[Dict[str, Any]]:
        """List Stripe payment methods for a customer."""
        try:
            payment_methods = stripe.PaymentMethod.list(
                customer=customer_id,
                type='card'
            )
            return [pm.to_dict() for pm in payment_methods.data]
        except stripe.error.StripeError:
            return []
        except Exception:
            return []
    
    def handle_webhook(self, payload: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
        """Handle Stripe webhook."""
        sig_header = headers.get('stripe-signature')
        
        if not sig_header or not self.webhook_secret:
            raise PaymentGatewayError("Invalid webhook signature or missing secret")
        
        try:
            # Verify webhook signature
            event = stripe.Webhook.construct_event(
                payload, sig_header, self.webhook_secret
            )
            
            return {
                'event_id': event['id'],
                'type': event['type'],
                'data': event['data'],
                'created': event['created']
            }
            
        except stripe.error.SignatureVerificationError:
            raise PaymentGatewayError("Invalid webhook signature")
        except Exception as e:
            raise PaymentGatewayError(f"Webhook processing failed: {str(e)}")
    
    def verify_webhook_signature(self, payload: str, signature: str, secret: str) -> bool:
        """Verify Stripe webhook signature."""
        try:
            stripe.Webhook.construct_event(payload, signature, secret)
            return True
        except stripe.error.SignatureVerificationError:
            return False
        except Exception:
            return False
    
    def get_supported_currencies(self) -> List[str]:
        """Get supported currencies for Stripe."""
        return [
            'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'DKK', 'NOK', 'SEK',
            'JPY', 'HKD', 'SGD', 'INR', 'BRL', 'MXN', 'PLN', 'CZK'
        ]
    
    def get_supported_payment_methods(self) -> List[str]:
        """Get supported payment methods for Stripe."""
        return [
            'card', 'apple_pay', 'google_pay', 'link', 'klarna', 'afterpay_clearpay',
            'bancontact', 'eps', 'giropay', 'ideal', 'p24', 'sepa_debit', 'sofort'
        ]
    
    def _get_or_create_customer(self, customer_data: CustomerData) -> stripe.Customer:
        """Get or create a Stripe customer."""
        # Try to find existing customer by email
        customers = stripe.Customer.list(email=customer_data.email, limit=1)
        
        if customers.data:
            return customers.data[0]
        
        # Create new customer
        customer_params = {
            'email': customer_data.email,
            'metadata': customer_data.metadata or {}
        }
        
        if customer_data.name:
            customer_params['name'] = customer_data.name
        
        if customer_data.phone:
            customer_params['phone'] = customer_data.phone
        
        if customer_data.address:
            customer_params['address'] = customer_data.address
        
        return stripe.Customer.create(**customer_params)
    
    def _map_stripe_status(self, stripe_status: str) -> PaymentStatus:
        """Map Stripe payment intent status to our status."""
        status_map = {
            'requires_payment_method': PaymentStatus.PENDING,
            'requires_confirmation': PaymentStatus.REQUIRES_ACTION,
            'requires_action': PaymentStatus.REQUIRES_ACTION,
            'processing': PaymentStatus.PROCESSING,
            'requires_capture': PaymentStatus.REQUIRES_ACTION,
            'canceled': PaymentStatus.CANCELLED,
            'succeeded': PaymentStatus.COMPLETED,
        }
        return status_map.get(stripe_status, PaymentStatus.PENDING)
    
    def _map_stripe_refund_status(self, stripe_status: str) -> RefundStatus:
        """Map Stripe refund status to our status."""
        status_map = {
            'pending': RefundStatus.PENDING,
            'succeeded': RefundStatus.COMPLETED,
            'failed': RefundStatus.FAILED,
            'canceled': RefundStatus.CANCELLED,
        }
        return status_map.get(stripe_status, RefundStatus.PENDING)
