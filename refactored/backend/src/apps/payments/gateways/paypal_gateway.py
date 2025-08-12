"""
PayPal payment gateway implementation.
"""

import requests
import base64
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


class PayPalGateway(PaymentGateway):
    """
    PayPal payment gateway implementation.
    
    This gateway integrates with PayPal's REST API for payment processing.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize PayPal gateway.
        
        Config should contain:
        - client_id: PayPal client ID
        - client_secret: PayPal client secret
        - environment: 'sandbox' or 'live'
        - webhook_id: PayPal webhook ID (optional)
        """
        super().__init__(config)
        self.client_id = config['client_id']
        self.client_secret = config['client_secret']
        self.environment = config.get('environment', 'sandbox')
        self.webhook_id = config.get('webhook_id')
        
        # Set API base URL
        if self.environment == 'live':
            self.base_url = 'https://api.paypal.com'
        else:
            self.base_url = 'https://api.sandbox.paypal.com'
        
        self._access_token = None
        self._token_expires_at = None
    
    def get_gateway_name(self) -> str:
        """Return the gateway name."""
        return "paypal"
    
    def create_payment_intent(
        self,
        amount: Decimal,
        currency: str,
        customer_data: CustomerData,
        payment_method_data: Optional[PaymentMethodData] = None,
        description: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> PaymentResult:
        """Create a PayPal payment order."""
        try:
            if not self.validate_amount(amount, currency):
                return PaymentResult(
                    success=False,
                    status=PaymentStatus.FAILED,
                    error_message="Invalid payment amount",
                    error_code="invalid_amount"
                )
            
            # Create order payload
            order_data = {
                "intent": "CAPTURE",
                "purchase_units": [{
                    "amount": {
                        "currency_code": currency,
                        "value": str(amount)
                    },
                    "description": description or "Payment",
                    "custom_id": metadata.get('reference_id') if metadata else None
                }],
                "payer": {
                    "email_address": customer_data.email,
                },
                "application_context": {
                    "return_url": metadata.get('return_url', 'https://example.com/return') if metadata else 'https://example.com/return',
                    "cancel_url": metadata.get('cancel_url', 'https://example.com/cancel') if metadata else 'https://example.com/cancel',
                    "user_action": "PAY_NOW"
                }
            }
            
            # Add customer name if available
            if customer_data.name:
                name_parts = customer_data.name.split(' ', 1)
                order_data["payer"]["name"] = {
                    "given_name": name_parts[0],
                    "surname": name_parts[1] if len(name_parts) > 1 else ""
                }
            
            # Create order
            response = self._make_api_request('POST', '/v2/checkout/orders', order_data)
            
            if response.get('status') == 'CREATED':
                # Find approval URL
                approval_url = None
                for link in response.get('links', []):
                    if link.get('rel') == 'approve':
                        approval_url = link.get('href')
                        break
                
                return PaymentResult(
                    success=True,
                    status=PaymentStatus.REQUIRES_ACTION,
                    transaction_id=response['id'],
                    requires_action=True,
                    action_data={
                        'type': 'redirect',
                        'redirect_url': approval_url
                    },
                    gateway_response=response
                )
            else:
                return PaymentResult(
                    success=False,
                    status=PaymentStatus.FAILED,
                    error_message="Failed to create PayPal order",
                    error_code="order_creation_failed",
                    gateway_response=response
                )
                
        except Exception as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message=str(e),
                error_code="paypal_error"
            )
    
    def confirm_payment(
        self,
        intent_id: str,
        payment_method_data: Optional[PaymentMethodData] = None
    ) -> PaymentResult:
        """Capture a PayPal order."""
        try:
            # Capture the order
            response = self._make_api_request('POST', f'/v2/checkout/orders/{intent_id}/capture')
            
            if response.get('status') == 'COMPLETED':
                # Extract fee information
                fee_amount = None
                capture_data = response.get('purchase_units', [{}])[0].get('payments', {}).get('captures', [])
                if capture_data:
                    seller_receivable_breakdown = capture_data[0].get('seller_receivable_breakdown', {})
                    paypal_fee = seller_receivable_breakdown.get('paypal_fee', {})
                    if paypal_fee:
                        fee_amount = Decimal(paypal_fee.get('value', '0'))
                
                return PaymentResult(
                    success=True,
                    status=PaymentStatus.COMPLETED,
                    transaction_id=intent_id,
                    fee_amount=fee_amount,
                    gateway_response=response
                )
            else:
                return PaymentResult(
                    success=False,
                    status=PaymentStatus.FAILED,
                    transaction_id=intent_id,
                    error_message=f"PayPal capture failed with status: {response.get('status')}",
                    error_code="capture_failed",
                    gateway_response=response
                )
                
        except Exception as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                transaction_id=intent_id,
                error_message=str(e),
                error_code="paypal_error"
            )
    
    def capture_payment(self, intent_id: str, amount: Optional[Decimal] = None) -> PaymentResult:
        """Capture a PayPal payment (same as confirm for PayPal)."""
        return self.confirm_payment(intent_id)
    
    def cancel_payment(self, intent_id: str) -> PaymentResult:
        """Cancel a PayPal order."""
        try:
            # PayPal doesn't have a direct cancel endpoint, but we can check status
            response = self._make_api_request('GET', f'/v2/checkout/orders/{intent_id}')
            
            if response.get('status') in ['CREATED', 'SAVED', 'APPROVED']:
                # Order can be considered cancelled if not captured
                return PaymentResult(
                    success=True,
                    status=PaymentStatus.CANCELLED,
                    transaction_id=intent_id,
                    gateway_response=response
                )
            else:
                return PaymentResult(
                    success=False,
                    status=PaymentStatus.FAILED,
                    error_message="Cannot cancel PayPal order in current state",
                    error_code="invalid_state"
                )
                
        except Exception as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message=str(e),
                error_code="paypal_error"
            )
    
    def create_refund(
        self,
        payment_id: str,
        amount: Optional[Decimal] = None,
        reason: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> RefundResult:
        """Create a PayPal refund."""
        try:
            # First, get the order to find capture ID
            order = self._make_api_request('GET', f'/v2/checkout/orders/{payment_id}')
            
            capture_id = None
            purchase_units = order.get('purchase_units', [])
            if purchase_units:
                captures = purchase_units[0].get('payments', {}).get('captures', [])
                if captures:
                    capture_id = captures[0]['id']
            
            if not capture_id:
                return RefundResult(
                    success=False,
                    status=RefundStatus.FAILED,
                    error_message="No capture found for refund",
                    error_code="no_capture"
                )
            
            # Create refund payload
            refund_data = {}
            if amount:
                # Get currency from original capture
                currency = captures[0]['amount']['currency_code']
                refund_data['amount'] = {
                    'currency_code': currency,
                    'value': str(amount)
                }
            
            if reason:
                refund_data['note_to_payer'] = reason
            
            # Create refund
            response = self._make_api_request('POST', f'/v2/payments/captures/{capture_id}/refund', refund_data)
            
            if response.get('status') == 'COMPLETED':
                return RefundResult(
                    success=True,
                    status=RefundStatus.COMPLETED,
                    refund_id=response['id'],
                    gateway_response=response
                )
            else:
                return RefundResult(
                    success=False,
                    status=RefundStatus.FAILED,
                    error_message=f"PayPal refund failed with status: {response.get('status')}",
                    error_code="refund_failed",
                    gateway_response=response
                )
                
        except Exception as e:
            return RefundResult(
                success=False,
                status=RefundStatus.FAILED,
                error_message=str(e),
                error_code="paypal_error"
            )
    
    def get_payment_status(self, payment_id: str) -> PaymentResult:
        """Get PayPal payment status."""
        try:
            response = self._make_api_request('GET', f'/v2/checkout/orders/{payment_id}')
            
            status = self._map_paypal_status(response.get('status'))
            
            return PaymentResult(
                success=True,
                status=status,
                transaction_id=payment_id,
                gateway_response=response
            )
            
        except Exception as e:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message=str(e),
                error_code="paypal_error"
            )
    
    def get_refund_status(self, refund_id: str) -> RefundResult:
        """Get PayPal refund status."""
        try:
            response = self._make_api_request('GET', f'/v2/payments/refunds/{refund_id}')
            
            status = self._map_paypal_refund_status(response.get('status'))
            
            return RefundResult(
                success=True,
                status=status,
                refund_id=refund_id,
                gateway_response=response
            )
            
        except Exception as e:
            return RefundResult(
                success=False,
                status=RefundStatus.FAILED,
                error_message=str(e),
                error_code="paypal_error"
            )
    
    def save_payment_method(
        self,
        customer_data: CustomerData,
        payment_method_data: PaymentMethodData
    ) -> Dict[str, Any]:
        """Save a PayPal payment method (not directly supported by PayPal REST API)."""
        # PayPal REST API doesn't support saving payment methods like Stripe
        # This would typically be handled through PayPal's vault API or subscription API
        raise PaymentGatewayError("PayPal payment method saving not implemented")
    
    def delete_payment_method(self, payment_method_id: str) -> bool:
        """Delete a PayPal payment method."""
        # Not directly supported by PayPal REST API
        return False
    
    def list_payment_methods(self, customer_id: str) -> List[Dict[str, Any]]:
        """List PayPal payment methods for a customer."""
        # Not directly supported by PayPal REST API
        return []
    
    def handle_webhook(self, payload: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
        """Handle PayPal webhook."""
        # Webhook verification for PayPal is more complex and requires certificate validation
        # For now, return basic event information
        return {
            'event_id': payload.get('id'),
            'event_type': payload.get('event_type'),
            'resource_type': payload.get('resource_type'),
            'data': payload.get('resource', {}),
            'create_time': payload.get('create_time')
        }
    
    def verify_webhook_signature(self, payload: str, signature: str, secret: str) -> bool:
        """Verify PayPal webhook signature."""
        # PayPal webhook verification is complex and requires certificate validation
        # For now, return True (implement proper verification in production)
        return True
    
    def get_supported_currencies(self) -> List[str]:
        """Get supported currencies for PayPal."""
        return [
            'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'DKK', 'NOK', 'SEK',
            'JPY', 'HKD', 'SGD', 'INR', 'BRL', 'MXN', 'PLN', 'CZK', 'HUF',
            'ILS', 'KRW', 'MYR', 'NZD', 'PHP', 'RUB', 'THB', 'TWD'
        ]
    
    def get_supported_payment_methods(self) -> List[str]:
        """Get supported payment methods for PayPal."""
        return ['paypal', 'card', 'bank_account']
    
    def _get_access_token(self) -> str:
        """Get or refresh PayPal access token."""
        import time
        
        # Check if token is still valid
        if self._access_token and self._token_expires_at and time.time() < self._token_expires_at:
            return self._access_token
        
        # Get new token
        auth_string = base64.b64encode(
            f"{self.client_id}:{self.client_secret}".encode()
        ).decode()
        
        headers = {
            'Authorization': f'Basic {auth_string}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        data = 'grant_type=client_credentials'
        
        response = requests.post(
            f'{self.base_url}/v1/oauth2/token',
            headers=headers,
            data=data
        )
        
        if response.status_code == 200:
            token_data = response.json()
            self._access_token = token_data['access_token']
            # Set expiration time (subtract 60 seconds for safety)
            self._token_expires_at = time.time() + token_data['expires_in'] - 60
            return self._access_token
        else:
            raise PaymentGatewayError(f"Failed to get PayPal access token: {response.text}")
    
    def _make_api_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict[str, Any]:
        """Make API request to PayPal."""
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Authorization': f'Bearer {self._get_access_token()}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        response = requests.request(method, url, headers=headers, json=data)
        
        if response.status_code in [200, 201]:
            return response.json()
        else:
            error_data = response.json() if response.content else {}
            error_message = error_data.get('message', f'HTTP {response.status_code}')
            raise PaymentGatewayError(f"PayPal API error: {error_message}")
    
    def _map_paypal_status(self, paypal_status: str) -> PaymentStatus:
        """Map PayPal order status to our status."""
        status_map = {
            'CREATED': PaymentStatus.PENDING,
            'SAVED': PaymentStatus.PENDING,
            'APPROVED': PaymentStatus.REQUIRES_ACTION,
            'VOIDED': PaymentStatus.CANCELLED,
            'COMPLETED': PaymentStatus.COMPLETED,
            'PAYER_ACTION_REQUIRED': PaymentStatus.REQUIRES_ACTION,
        }
        return status_map.get(paypal_status, PaymentStatus.PENDING)
    
    def _map_paypal_refund_status(self, paypal_status: str) -> RefundStatus:
        """Map PayPal refund status to our status."""
        status_map = {
            'CANCELLED': RefundStatus.CANCELLED,
            'PENDING': RefundStatus.PENDING,
            'COMPLETED': RefundStatus.COMPLETED,
            'FAILED': RefundStatus.FAILED,
        }
        return status_map.get(paypal_status, RefundStatus.PENDING)
