"""
Base payment gateway abstract class and common types.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from decimal import Decimal
from typing import Dict, Any, Optional, List
from enum import Enum


class PaymentStatus(Enum):
    """Payment status enumeration."""
    PENDING = "pending"
    PROCESSING = "processing"
    REQUIRES_ACTION = "requires_action"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"


class RefundStatus(Enum):
    """Refund status enumeration."""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class PaymentResult:
    """Result of a payment operation."""
    success: bool
    status: PaymentStatus
    transaction_id: Optional[str] = None
    gateway_response: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    error_code: Optional[str] = None
    requires_action: bool = False
    action_data: Optional[Dict[str, Any]] = None
    fee_amount: Optional[Decimal] = None
    
    @property
    def is_successful(self) -> bool:
        """Check if payment was successful."""
        return self.success and self.status == PaymentStatus.COMPLETED
    
    @property
    def is_pending(self) -> bool:
        """Check if payment is pending."""
        return self.status in [
            PaymentStatus.PENDING,
            PaymentStatus.PROCESSING,
            PaymentStatus.REQUIRES_ACTION
        ]
    
    @property
    def is_failed(self) -> bool:
        """Check if payment failed."""
        return not self.success or self.status in [
            PaymentStatus.FAILED,
            PaymentStatus.CANCELLED
        ]


@dataclass
class RefundResult:
    """Result of a refund operation."""
    success: bool
    status: RefundStatus
    refund_id: Optional[str] = None
    gateway_response: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    error_code: Optional[str] = None


@dataclass
class PaymentMethodData:
    """Payment method data for creating payments."""
    method_type: str  # 'card', 'paypal', 'bank_account', etc.
    token: Optional[str] = None  # Token from frontend
    card_number: Optional[str] = None
    card_exp_month: Optional[int] = None
    card_exp_year: Optional[int] = None
    card_cvc: Optional[str] = None
    cardholder_name: Optional[str] = None
    billing_address: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class CustomerData:
    """Customer data for payment processing."""
    email: str
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, Any]] = None


class PaymentGatewayError(Exception):
    """Base exception for payment gateway errors."""
    
    def __init__(
        self,
        message: str,
        error_code: Optional[str] = None,
        gateway_response: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.error_code = error_code
        self.gateway_response = gateway_response


class PaymentGateway(ABC):
    """
    Abstract base class for payment gateways.
    
    This class defines the interface that all payment gateways must implement.
    It provides a consistent API for different payment providers.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the payment gateway with configuration.
        
        Args:
            config: Gateway-specific configuration (API keys, URLs, etc.)
        """
        self.config = config
        self.name = self.get_gateway_name()
    
    @abstractmethod
    def get_gateway_name(self) -> str:
        """Return the name of the payment gateway."""
        pass
    
    @abstractmethod
    def create_payment_intent(
        self,
        amount: Decimal,
        currency: str,
        customer_data: CustomerData,
        payment_method_data: Optional[PaymentMethodData] = None,
        description: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> PaymentResult:
        """
        Create a payment intent.
        
        Args:
            amount: Payment amount
            currency: Payment currency (USD, EUR, etc.)
            customer_data: Customer information
            payment_method_data: Payment method data (optional for saved methods)
            description: Payment description
            metadata: Additional metadata
            
        Returns:
            PaymentResult with intent information
        """
        pass
    
    @abstractmethod
    def confirm_payment(
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
            PaymentResult with confirmation status
        """
        pass
    
    @abstractmethod
    def capture_payment(self, intent_id: str, amount: Optional[Decimal] = None) -> PaymentResult:
        """
        Capture a payment (for manual capture).
        
        Args:
            intent_id: Payment intent ID
            amount: Amount to capture (optional, captures full amount if not specified)
            
        Returns:
            PaymentResult with capture status
        """
        pass
    
    @abstractmethod
    def cancel_payment(self, intent_id: str) -> PaymentResult:
        """
        Cancel a payment intent.
        
        Args:
            intent_id: Payment intent ID
            
        Returns:
            PaymentResult with cancellation status
        """
        pass
    
    @abstractmethod
    def create_refund(
        self,
        payment_id: str,
        amount: Optional[Decimal] = None,
        reason: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> RefundResult:
        """
        Create a refund for a payment.
        
        Args:
            payment_id: Original payment ID
            amount: Refund amount (optional, refunds full amount if not specified)
            reason: Refund reason
            metadata: Additional metadata
            
        Returns:
            RefundResult with refund information
        """
        pass
    
    @abstractmethod
    def get_payment_status(self, payment_id: str) -> PaymentResult:
        """
        Get the current status of a payment.
        
        Args:
            payment_id: Payment ID
            
        Returns:
            PaymentResult with current status
        """
        pass
    
    @abstractmethod
    def get_refund_status(self, refund_id: str) -> RefundResult:
        """
        Get the current status of a refund.
        
        Args:
            refund_id: Refund ID
            
        Returns:
            RefundResult with current status
        """
        pass
    
    @abstractmethod
    def save_payment_method(
        self,
        customer_data: CustomerData,
        payment_method_data: PaymentMethodData
    ) -> Dict[str, Any]:
        """
        Save a payment method for future use.
        
        Args:
            customer_data: Customer information
            payment_method_data: Payment method data
            
        Returns:
            Dictionary with saved payment method information
        """
        pass
    
    @abstractmethod
    def delete_payment_method(self, payment_method_id: str) -> bool:
        """
        Delete a saved payment method.
        
        Args:
            payment_method_id: Payment method ID
            
        Returns:
            True if successfully deleted, False otherwise
        """
        pass
    
    @abstractmethod
    def list_payment_methods(self, customer_id: str) -> List[Dict[str, Any]]:
        """
        List saved payment methods for a customer.
        
        Args:
            customer_id: Customer ID
            
        Returns:
            List of payment method information
        """
        pass
    
    @abstractmethod
    def handle_webhook(self, payload: Dict[str, Any], headers: Dict[str, str]) -> Dict[str, Any]:
        """
        Handle webhook events from the payment gateway.
        
        Args:
            payload: Webhook payload
            headers: HTTP headers
            
        Returns:
            Dictionary with processed webhook information
        """
        pass
    
    @abstractmethod
    def verify_webhook_signature(self, payload: str, signature: str, secret: str) -> bool:
        """
        Verify webhook signature for security.
        
        Args:
            payload: Raw webhook payload
            signature: Webhook signature
            secret: Webhook secret
            
        Returns:
            True if signature is valid, False otherwise
        """
        pass
    
    def get_supported_currencies(self) -> List[str]:
        """
        Get list of supported currencies.
        
        Returns:
            List of currency codes
        """
        return ['USD', 'EUR', 'GBP']  # Default currencies
    
    def get_supported_payment_methods(self) -> List[str]:
        """
        Get list of supported payment methods.
        
        Returns:
            List of payment method types
        """
        return ['card']  # Default payment methods
    
    def validate_amount(self, amount: Decimal, currency: str) -> bool:
        """
        Validate payment amount for the gateway.
        
        Args:
            amount: Payment amount
            currency: Payment currency
            
        Returns:
            True if amount is valid, False otherwise
        """
        if amount <= 0:
            return False
        
        # Check minimum amounts (common gateway requirements)
        min_amounts = {
            'USD': Decimal('0.50'),
            'EUR': Decimal('0.50'),
            'GBP': Decimal('0.30'),
        }
        
        min_amount = min_amounts.get(currency, Decimal('0.50'))
        return amount >= min_amount
    
    def format_amount_for_gateway(self, amount: Decimal, currency: str) -> int:
        """
        Format amount for gateway API (usually in cents).
        
        Args:
            amount: Decimal amount
            currency: Currency code
            
        Returns:
            Amount in gateway format (cents)
        """
        # Most gateways expect amounts in cents
        zero_decimal_currencies = ['JPY', 'KRW', 'VND']
        
        if currency in zero_decimal_currencies:
            return int(amount)
        else:
            return int(amount * 100)
    
    def format_amount_from_gateway(self, amount: int, currency: str) -> Decimal:
        """
        Format amount from gateway API (usually from cents).
        
        Args:
            amount: Amount from gateway (cents)
            currency: Currency code
            
        Returns:
            Decimal amount
        """
        zero_decimal_currencies = ['JPY', 'KRW', 'VND']
        
        if currency in zero_decimal_currencies:
            return Decimal(str(amount))
        else:
            return Decimal(str(amount)) / 100
