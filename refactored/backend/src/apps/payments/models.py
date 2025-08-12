"""
Payment models for the payments application.
"""

import uuid
from decimal import Decimal
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

from src.utils.models import TimestampMixin


class PaymentMethod(TimestampMixin, models.Model):
    """
    Payment method for a user (credit card, PayPal, etc.).
    """
    PAYMENT_TYPE_CHOICES = [
        ('credit_card', _('Credit Card')),
        ('debit_card', _('Debit Card')),
        ('paypal', _('PayPal')),
        ('stripe', _('Stripe')),
        ('apple_pay', _('Apple Pay')),
        ('google_pay', _('Google Pay')),
        ('bank_transfer', _('Bank Transfer')),
        ('crypto', _('Cryptocurrency')),
        ('other', _('Other')),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payment_methods',
        verbose_name=_("User")
    )
    name = models.CharField(
        max_length=100,
        verbose_name=_("Method name"),
        help_text=_("Display name for this payment method")
    )
    payment_type = models.CharField(
        max_length=20,
        choices=PAYMENT_TYPE_CHOICES,
        verbose_name=_("Payment type")
    )
    provider = models.CharField(
        max_length=50,
        verbose_name=_("Payment provider"),
        help_text=_("Payment gateway provider (stripe, paypal, etc.)")
    )
    provider_method_id = models.CharField(
        max_length=255,
        verbose_name=_("Provider method ID"),
        help_text=_("Payment method ID from the provider")
    )
    is_default = models.BooleanField(
        default=False,
        verbose_name=_("Is default"),
        help_text=_("Whether this is the user's default payment method")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active"),
        help_text=_("Whether this payment method is active")
    )
    
    # Card-specific fields (optional)
    card_last_four = models.CharField(
        max_length=4,
        blank=True,
        verbose_name=_("Card last four digits"),
        help_text=_("Last 4 digits of the card number")
    )
    card_brand = models.CharField(
        max_length=20,
        blank=True,
        verbose_name=_("Card brand"),
        help_text=_("Card brand (visa, mastercard, etc.)")
    )
    card_exp_month = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_("Card expiration month")
    )
    card_exp_year = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_("Card expiration year")
    )
    
    # Additional metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Metadata"),
        help_text=_("Additional metadata from the payment provider")
    )

    class Meta:
        verbose_name = _("Payment Method")
        verbose_name_plural = _("Payment Methods")
        ordering = ['-is_default', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_default']),
            models.Index(fields=['provider', 'provider_method_id']),
        ]

    def __str__(self):
        if self.card_last_four:
            return f"{self.name} •••• {self.card_last_four}"
        return self.name

    def save(self, *args, **kwargs):
        # Ensure only one default payment method per user
        if self.is_default:
            PaymentMethod.objects.filter(
                user=self.user,
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def clean(self):
        # Validate card expiration if provided
        if self.card_exp_month and (self.card_exp_month < 1 or self.card_exp_month > 12):
            raise ValidationError({'card_exp_month': _('Invalid expiration month')})
        
        if self.card_exp_year and self.card_exp_year < 2024:
            raise ValidationError({'card_exp_year': _('Card has expired')})


class Payment(TimestampMixin, models.Model):
    """
    Payment transaction record.
    """
    STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('processing', _('Processing')),
        ('requires_action', _('Requires Action')),
        ('completed', _('Completed')),
        ('failed', _('Failed')),
        ('cancelled', _('Cancelled')),
        ('refunded', _('Refunded')),
        ('partially_refunded', _('Partially Refunded')),
    ]

    CURRENCY_CHOICES = [
        ('USD', _('US Dollar')),
        ('EUR', _('Euro')),
        ('GBP', _('British Pound')),
        ('RUB', _('Russian Ruble')),
        ('JPY', _('Japanese Yen')),
        ('CNY', _('Chinese Yuan')),
    ]

    # Unique payment identifier
    payment_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name=_("Payment ID")
    )
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payments',
        verbose_name=_("User")
    )
    payment_method = models.ForeignKey(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments',
        verbose_name=_("Payment method")
    )
    
    # Payment details
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_("Amount")
    )
    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default='USD',
        verbose_name=_("Currency")
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_("Status")
    )
    
    # Gateway information
    gateway = models.CharField(
        max_length=50,
        verbose_name=_("Payment gateway"),
        help_text=_("Payment gateway used for this transaction")
    )
    gateway_transaction_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Gateway transaction ID"),
        help_text=_("Transaction ID from the payment gateway")
    )
    gateway_response = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Gateway response"),
        help_text=_("Full response from the payment gateway")
    )
    
    # Transaction details
    description = models.TextField(
        blank=True,
        default="",
        help_text="Description of what the payment is for"
    )
    reference_id = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name=_("Reference ID"),
        help_text=_("External reference ID (order ID, invoice ID, etc.)")
    )
    
    # Fees and amounts
    fee_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Fee amount"),
        help_text=_("Payment processing fee")
    )
    net_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name=_("Net amount"),
        help_text=_("Amount after fees")
    )
    
    # Timestamps
    authorized_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Authorized at")
    )
    captured_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Captured at")
    )
    failed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Failed at")
    )
    
    # Failure information
    failure_reason = models.TextField(
        blank=True,
        verbose_name=_("Failure reason"),
        help_text=_("Reason for payment failure")
    )
    failure_code = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_("Failure code"),
        help_text=_("Error code from payment gateway")
    )
    
    # Additional metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Metadata"),
        help_text=_("Additional payment metadata")
    )

    class Meta:
        verbose_name = _("Payment")
        verbose_name_plural = _("Payments")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['gateway', 'gateway_transaction_id']),
            models.Index(fields=['reference_id']),
            models.Index(fields=['status', 'created_at']),
        ]

    def __str__(self):
        return f"Payment {self.payment_id} - {self.amount} {self.currency}"

    def save(self, *args, **kwargs):
        # Calculate net amount if not provided
        if self.net_amount is None:
            self.net_amount = self.amount - self.fee_amount
        super().save(*args, **kwargs)

    @property
    def is_successful(self) -> bool:
        """Check if payment was successful."""
        return self.status == 'completed'

    @property
    def is_pending(self) -> bool:
        """Check if payment is pending."""
        return self.status in ['pending', 'processing', 'requires_action']

    @property
    def is_failed(self) -> bool:
        """Check if payment failed."""
        return self.status in ['failed', 'cancelled']

    def can_be_refunded(self) -> bool:
        """Check if payment can be refunded."""
        return self.status in ['completed'] and self.amount > 0


class PaymentRefund(TimestampMixin, models.Model):
    """
    Payment refund record.
    """
    STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('processing', _('Processing')),
        ('completed', _('Completed')),
        ('failed', _('Failed')),
        ('cancelled', _('Cancelled')),
    ]

    refund_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name=_("Refund ID")
    )
    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name='refunds',
        verbose_name=_("Payment")
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_("Refund amount")
    )
    currency = models.CharField(
        max_length=3,
        verbose_name=_("Currency")
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_("Status")
    )
    reason = models.TextField(
        blank=True,
        verbose_name=_("Refund reason"),
        help_text=_("Reason for the refund")
    )
    
    # Gateway information
    gateway_refund_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Gateway refund ID"),
        help_text=_("Refund ID from the payment gateway")
    )
    gateway_response = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Gateway response")
    )
    
    # Timestamps
    processed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Processed at")
    )
    failed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Failed at")
    )
    
    # Failure information
    failure_reason = models.TextField(
        blank=True,
        verbose_name=_("Failure reason")
    )
    
    # Metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Metadata")
    )

    class Meta:
        verbose_name = _("Payment Refund")
        verbose_name_plural = _("Payment Refunds")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment', 'status']),
            models.Index(fields=['gateway_refund_id']),
        ]

    def __str__(self):
        return f"Refund {self.refund_id} - {self.amount} {self.currency}"

    def save(self, *args, **kwargs):
        # Set currency from payment if not provided
        if not self.currency:
            self.currency = self.payment.currency
        super().save(*args, **kwargs)

    def clean(self):
        # Validate refund amount doesn't exceed payment amount
        if self.payment:
            total_refunded = self.payment.refunds.exclude(pk=self.pk).filter(
                status='completed'
            ).aggregate(
                total=models.Sum('amount')
            )['total'] or Decimal('0.00')
            
            if (total_refunded + self.amount) > self.payment.amount:
                raise ValidationError(
                    _('Refund amount exceeds remaining refundable amount')
                )


class PaymentWebhook(TimestampMixin, models.Model):
    """
    Webhook events from payment gateways.
    """
    STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('processed', _('Processed')),
        ('failed', _('Failed')),
        ('ignored', _('Ignored')),
    ]

    webhook_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name=_("Webhook ID")
    )
    gateway = models.CharField(
        max_length=50,
        verbose_name=_("Payment gateway")
    )
    event_type = models.CharField(
        max_length=100,
        verbose_name=_("Event type"),
        help_text=_("Type of webhook event")
    )
    gateway_event_id = models.CharField(
        max_length=255,
        verbose_name=_("Gateway event ID"),
        help_text=_("Event ID from the payment gateway")
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_("Processing status")
    )
    
    # Webhook data
    payload = models.JSONField(
        verbose_name=_("Webhook payload"),
        help_text=_("Full webhook payload from the gateway")
    )
    headers = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Webhook headers"),
        help_text=_("HTTP headers from the webhook request")
    )
    
    # Processing information
    processed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Processed at")
    )
    error_message = models.TextField(
        blank=True,
        verbose_name=_("Error message"),
        help_text=_("Error message if processing failed")
    )
    
    # Related objects
    related_payment = models.ForeignKey(
        Payment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='webhooks',
        verbose_name=_("Related payment")
    )

    class Meta:
        verbose_name = _("Payment Webhook")
        verbose_name_plural = _("Payment Webhooks")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['gateway', 'event_type']),
            models.Index(fields=['gateway_event_id']),
            models.Index(fields=['status', 'created_at']),
        ]
        unique_together = [['gateway', 'gateway_event_id']]

    def __str__(self):
        return f"Webhook {self.gateway} - {self.event_type}"

    def mark_as_processed(self):
        """Mark webhook as processed."""
        from django.utils import timezone
        self.status = 'processed'
        self.processed_at = timezone.now()
        self.save(update_fields=['status', 'processed_at'])

    def mark_as_failed(self, error_message: str):
        """Mark webhook as failed."""
        self.status = 'failed'
        self.error_message = error_message
        self.save(update_fields=['status', 'error_message'])


class PaymentIntent(TimestampMixin, models.Model):
    """
    Payment intent for handling payment authorization and capture.
    """
    STATUS_CHOICES = [
        ('requires_payment_method', _('Requires Payment Method')),
        ('requires_confirmation', _('Requires Confirmation')),
        ('requires_action', _('Requires Action')),
        ('processing', _('Processing')),
        ('requires_capture', _('Requires Capture')),
        ('cancelled', _('Cancelled')),
        ('succeeded', _('Succeeded')),
    ]

    intent_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        verbose_name=_("Intent ID")
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='payment_intents',
        verbose_name=_("User")
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name=_("Amount")
    )
    currency = models.CharField(
        max_length=3,
        choices=Payment.CURRENCY_CHOICES,
        default='USD',
        verbose_name=_("Currency")
    )
    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='requires_payment_method',
        verbose_name=_("Status")
    )
    
    # Gateway information
    gateway = models.CharField(
        max_length=50,
        verbose_name=_("Payment gateway")
    )
    gateway_intent_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Gateway intent ID")
    )
    client_secret = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Client secret"),
        help_text=_("Secret for client-side payment confirmation")
    )
    
    # Intent details
    description = models.TextField(
        blank=True,
        default="",
        verbose_name=_("Description")
    )
    reference_id = models.CharField(
        max_length=255,
        blank=True,
        default="",
        verbose_name=_("Reference ID")
    )
    
    # Capture method
    capture_method = models.CharField(
        max_length=20,
        choices=[
            ('automatic', _('Automatic')),
            ('manual', _('Manual')),
        ],
        default='automatic',
        verbose_name=_("Capture method")
    )
    
    # Related payment (created when intent succeeds)
    payment = models.OneToOneField(
        Payment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='intent',
        verbose_name=_("Payment")
    )
    
    # Metadata
    metadata = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Metadata")
    )

    class Meta:
        verbose_name = _("Payment Intent")
        verbose_name_plural = _("Payment Intents")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['gateway', 'gateway_intent_id']),
            models.Index(fields=['reference_id']),
        ]

    def __str__(self):
        return f"Intent {self.intent_id} - {self.amount} {self.currency}"

    @property
    def is_successful(self) -> bool:
        """Check if intent was successful."""
        return self.status == 'succeeded'

    @property
    def requires_action(self) -> bool:
        """Check if intent requires user action."""
        return self.status in ['requires_action', 'requires_confirmation']
