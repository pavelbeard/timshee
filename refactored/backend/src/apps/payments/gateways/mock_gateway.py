"""
Mock payment gateway for testing purposes.
"""

import uuid
import time
from decimal import Decimal
from typing import Dict, Any, Optional, List

from .base import (
    PaymentGateway,
    PaymentResult,
    RefundResult,
    PaymentStatus,
    RefundStatus,
    PaymentMethodData,
    CustomerData
)


class MockGateway(PaymentGateway):
    """
    Mock payment gateway for testing and development.
    
    This gateway simulates payment processing without making real transactions.
    Useful for testing payment flows and development environments.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize mock gateway.
        
        Config options:
        - simulate_failures: Whether to simulate random failures
        - failure_rate: Failure rate (0.0 to 1.0)
        - processing_delay: Simulate processing delay in seconds
        """
        super().__init__(config)
        self.simulate_failures = config.get('simulate_failures', False)
        self.failure_rate = config.get('failure_rate', 0.1)
        self.processing_delay = config.get('processing_delay', 0)
        
        # In-memory storage for mock data
        self._payments = {}
        self._refunds = {}
        self._payment_methods = {}
        self._customers = {}
    
    def get_gateway_name(self) -> str:
        """Return the gateway name."""
        return "mock"
    
    def create_payment_intent(
        self,
        amount: Decimal,
        currency: str,
        customer_data: CustomerData,
        payment_method_data: Optional[PaymentMethodData] = None,
        description: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> PaymentResult:
        """Create a mock payment intent."""
        if not self.validate_amount(amount, currency):
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message="Invalid payment amount",
                error_code="invalid_amount"
            )
        
        # Simulate processing delay
        if self.processing_delay > 0:
            time.sleep(self.processing_delay)
        
        # Generate mock intent ID
        intent_id = f"mock_intent_{uuid.uuid4().hex[:16]}"
        
        # Simulate failure if configured
        if self._should_simulate_failure():
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                transaction_id=intent_id,
                error_message="Simulated payment failure",
                error_code="card_declined",
                gateway_response={
                    "intent_id": intent_id,
                    "status": "failed",
                    "error": {
                        "code": "card_declined",
                        "message": "Your card was declined."
                    }
                }
            )
        
        # Store mock payment data
        self._payments[intent_id] = {
            "intent_id": intent_id,
            "amount": amount,
            "currency": currency,
            "status": "requires_confirmation",
            "customer_data": customer_data,
            "payment_method_data": payment_method_data,
            "description": description,
            "metadata": metadata or {},
            "created_at": time.time(),
        }
        
        # Mock requires action scenario
        if payment_method_data and payment_method_data.card_number == "4000000000003220":
            return PaymentResult(
                success=True,
                status=PaymentStatus.REQUIRES_ACTION,
                transaction_id=intent_id,
                requires_action=True,
                action_data={
                    "type": "use_stripe_sdk",
                    "stripe_js": {
                        "type": "three_d_secure_redirect",
                        "redirect_url": "https://hooks.stripe.com/3d_secure_2_eap/begin_test/..."
                    }
                },
                gateway_response={
                    "intent_id": intent_id,
                    "status": "requires_action",
                    "client_secret": f"mock_secret_{intent_id}"
                }
            )
        
        return PaymentResult(
            success=True,
            status=PaymentStatus.REQUIRES_ACTION,
            transaction_id=intent_id,
            requires_action=True,
            action_data={
                "type": "confirm_payment",
                "client_secret": f"mock_secret_{intent_id}"
            },
            gateway_response={
                "intent_id": intent_id,
                "status": "requires_confirmation",
                "client_secret": f"mock_secret_{intent_id}"
            }
        )
    
    def confirm_payment(
        self,
        intent_id: str,
        payment_method_data: Optional[PaymentMethodData] = None
    ) -> PaymentResult:
        """Confirm a mock payment intent."""
        if intent_id not in self._payments:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message="Payment intent not found",
                error_code="intent_not_found"
            )
        
        payment_data = self._payments[intent_id]
        
        # Simulate processing delay
        if self.processing_delay > 0:
            time.sleep(self.processing_delay)
        
        # Simulate failure if configured
        if self._should_simulate_failure():
            payment_data["status"] = "failed"
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                transaction_id=intent_id,
                error_message="Payment confirmation failed",
                error_code="payment_failed",
                gateway_response={
                    "intent_id": intent_id,
                    "status": "failed"
                }
            )
        
        # Update payment status
        payment_data["status"] = "succeeded"
        payment_data["confirmed_at"] = time.time()
        
        # Calculate mock fee
        fee_amount = payment_data["amount"] * Decimal("0.029") + Decimal("0.30")
        
        return PaymentResult(
            success=True,
            status=PaymentStatus.COMPLETED,
            transaction_id=intent_id,
            fee_amount=fee_amount,
            gateway_response={
                "intent_id": intent_id,
                "status": "succeeded",
                "amount": int(payment_data["amount"] * 100),
                "currency": payment_data["currency"],
                "charges": {
                    "data": [{
                        "id": f"mock_charge_{uuid.uuid4().hex[:16]}",
                        "amount": int(payment_data["amount"] * 100),
                        "currency": payment_data["currency"],
                        "status": "succeeded"
                    }]
                }
            }
        )
    
    def capture_payment(self, intent_id: str, amount: Optional[Decimal] = None) -> PaymentResult:
        """Capture a mock payment."""
        if intent_id not in self._payments:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message="Payment intent not found",
                error_code="intent_not_found"
            )
        
        payment_data = self._payments[intent_id]
        
        if payment_data["status"] != "requires_capture":
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message="Payment not ready for capture",
                error_code="invalid_state"
            )
        
        # Update payment status
        payment_data["status"] = "succeeded"
        payment_data["captured_at"] = time.time()
        
        if amount:
            payment_data["captured_amount"] = amount
        
        return PaymentResult(
            success=True,
            status=PaymentStatus.COMPLETED,
            transaction_id=intent_id,
            gateway_response={
                "intent_id": intent_id,
                "status": "succeeded"
            }
        )
    
    def cancel_payment(self, intent_id: str) -> PaymentResult:
        """Cancel a mock payment intent."""
        if intent_id not in self._payments:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message="Payment intent not found",
                error_code="intent_not_found"
            )
        
        payment_data = self._payments[intent_id]
        payment_data["status"] = "canceled"
        payment_data["canceled_at"] = time.time()
        
        return PaymentResult(
            success=True,
            status=PaymentStatus.CANCELLED,
            transaction_id=intent_id,
            gateway_response={
                "intent_id": intent_id,
                "status": "canceled"
            }
        )
    
    def create_refund(
        self,
        payment_id: str,
        amount: Optional[Decimal] = None,
        reason: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> RefundResult:
        """Create a mock refund."""
        if payment_id not in self._payments:
            return RefundResult(
                success=False,
                status=RefundStatus.FAILED,
                error_message="Payment not found",
                error_code="payment_not_found"
            )
        
        payment_data = self._payments[payment_id]
        
        if payment_data["status"] != "succeeded":
            return RefundResult(
                success=False,
                status=RefundStatus.FAILED,
                error_message="Payment not eligible for refund",
                error_code="invalid_state"
            )
        
        refund_id = f"mock_refund_{uuid.uuid4().hex[:16]}"
        refund_amount = amount or payment_data["amount"]
        
        # Store refund data
        self._refunds[refund_id] = {
            "refund_id": refund_id,
            "payment_id": payment_id,
            "amount": refund_amount,
            "currency": payment_data["currency"],
            "status": "succeeded",
            "reason": reason,
            "metadata": metadata or {},
            "created_at": time.time(),
        }
        
        return RefundResult(
            success=True,
            status=RefundStatus.COMPLETED,
            refund_id=refund_id,
            gateway_response={
                "refund_id": refund_id,
                "payment_intent": payment_id,
                "amount": int(refund_amount * 100),
                "currency": payment_data["currency"],
                "status": "succeeded"
            }
        )
    
    def get_payment_status(self, payment_id: str) -> PaymentResult:
        """Get mock payment status."""
        if payment_id not in self._payments:
            return PaymentResult(
                success=False,
                status=PaymentStatus.FAILED,
                error_message="Payment not found",
                error_code="payment_not_found"
            )
        
        payment_data = self._payments[payment_id]
        status_map = {
            "requires_confirmation": PaymentStatus.REQUIRES_ACTION,
            "requires_capture": PaymentStatus.REQUIRES_ACTION,
            "succeeded": PaymentStatus.COMPLETED,
            "failed": PaymentStatus.FAILED,
            "canceled": PaymentStatus.CANCELLED,
        }
        
        return PaymentResult(
            success=True,
            status=status_map.get(payment_data["status"], PaymentStatus.PENDING),
            transaction_id=payment_id,
            gateway_response=payment_data
        )
    
    def get_refund_status(self, refund_id: str) -> RefundResult:
        """Get mock refund status."""
        if refund_id not in self._refunds:
            return RefundResult(
                success=False,
                status=RefundStatus.FAILED,
                error_message="Refund not found",
                error_code="refund_not_found"
            )
        
        refund_data = self._refunds[refund_id]
        return RefundResult(
            success=True,
            status=RefundStatus.COMPLETED,
            refund_id=refund_id,
            gateway_response=refund_data
        )
    
    def save_payment_method(
        self,
        customer_data: CustomerData,
        payment_method_data: PaymentMethodData
    ) -> Dict[str, Any]:
        """Save a mock payment method."""
        customer_id = f"mock_customer_{uuid.uuid4().hex[:16]}"
        payment_method_id = f"mock_pm_{uuid.uuid4().hex[:16]}"
        
        # Store customer
        self._customers[customer_id] = {
            "customer_id": customer_id,
            "email": customer_data.email,
            "name": customer_data.name,
            "phone": customer_data.phone,
            "address": customer_data.address,
            "created_at": time.time(),
        }
        
        # Store payment method
        payment_method = {
            "payment_method_id": payment_method_id,
            "customer_id": customer_id,
            "type": payment_method_data.method_type,
            "created_at": time.time(),
        }
        
        if payment_method_data.method_type == "card":
            payment_method.update({
                "card": {
                    "last4": payment_method_data.card_number[-4:] if payment_method_data.card_number else "4242",
                    "brand": "visa",
                    "exp_month": payment_method_data.card_exp_month,
                    "exp_year": payment_method_data.card_exp_year,
                }
            })
        
        self._payment_methods[payment_method_id] = payment_method
        
        return payment_method
    
    def delete_payment_method(self, payment_method_id: str) -> bool:
        """Delete a mock payment method."""
        if payment_method_id in self._payment_methods:
            del self._payment_methods[payment_method_id]
            return True
        return False
    
    def list_payment_methods(self, customer_id: str) -> List[Dict[str, Any]]:
        """List mock payment methods for a customer."""
        return [
            pm for pm in self._payment_methods.values()
            if pm.get("customer_id") == customer_id
        ]
    
    def handle_webhook(self, payload: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
        """Handle mock webhook."""
        return {
            "event_id": f"mock_event_{uuid.uuid4().hex[:16]}",
            "type": payload.get("type", "payment_intent.succeeded"),
            "processed": True,
            "data": payload.get("data", {})
        }
    
    def verify_webhook_signature(self, payload: str, signature: str, secret: str) -> bool:
        """Verify mock webhook signature."""
        # For mock gateway, always return True
        return True
    
    def get_supported_currencies(self) -> List[str]:
        """Get supported currencies for mock gateway."""
        return ['USD', 'EUR', 'GBP', 'RUB', 'JPY']
    
    def get_supported_payment_methods(self) -> List[str]:
        """Get supported payment methods for mock gateway."""
        return ['card', 'paypal', 'apple_pay', 'google_pay']
    
    def _should_simulate_failure(self) -> bool:
        """Determine if should simulate a failure."""
        if not self.simulate_failures:
            return False
        
        import random
        return random.random() < self.failure_rate
    
    # Helper methods for testing
    def get_mock_payment_data(self, payment_id: str) -> Optional[Dict[str, Any]]:
        """Get mock payment data for testing."""
        return self._payments.get(payment_id)
    
    def get_mock_refund_data(self, refund_id: str) -> Optional[Dict[str, Any]]:
        """Get mock refund data for testing."""
        return self._refunds.get(refund_id)
    
    def clear_mock_data(self):
        """Clear all mock data."""
        self._payments.clear()
        self._refunds.clear()
        self._payment_methods.clear()
        self._customers.clear()
