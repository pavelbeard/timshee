"""
Notification models for the notifications application.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.template import Template, Context

from src.utils.models import TimestampMixin


class NotificationTemplate(TimestampMixin, models.Model):
    """
    Template for notifications that can be reused.
    """
    NOTIFICATION_TYPE_CHOICES = [
        ('email', _('Email')),
        ('sms', _('SMS')),
        ('push', _('Push Notification')),
        ('in_app', _('In-App Notification')),
    ]

    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_("Template name"),
        help_text=_("Unique identifier for this template")
    )
    subject = models.CharField(
        max_length=255,
        verbose_name=_("Subject"),
        help_text=_("Subject line for the notification. Supports Django template syntax.")
    )
    content = models.TextField(
        verbose_name=_("Content"),
        help_text=_("Content of the notification. Supports Django template syntax.")
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPE_CHOICES,
        default='email',
        verbose_name=_("Notification type")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active"),
        help_text=_("Whether this template is active and can be used")
    )

    class Meta:
        verbose_name = _("Notification Template")
        verbose_name_plural = _("Notification Templates")
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_notification_type_display()})"

    def render_subject(self, context_data=None):
        """Render the subject with context data."""
        if context_data is None:
            context_data = {}
        
        template = Template(self.subject)
        context = Context(context_data)
        return template.render(context)

    def render_content(self, context_data=None):
        """Render the content with context data."""
        if context_data is None:
            context_data = {}
        
        template = Template(self.content)
        context = Context(context_data)
        return template.render(context)


class Notification(TimestampMixin, models.Model):
    """
    Individual notification instances.
    """
    STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('sent', _('Sent')),
        ('delivered', _('Delivered')),
        ('failed', _('Failed')),
        ('cancelled', _('Cancelled')),
    ]

    NOTIFICATION_TYPE_CHOICES = [
        ('email', _('Email')),
        ('sms', _('SMS')),
        ('push', _('Push Notification')),
        ('in_app', _('In-App Notification')),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
        verbose_name=_("User")
    )
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
        verbose_name=_("Template"),
        help_text=_("Template used to generate this notification")
    )
    subject = models.CharField(
        max_length=255,
        verbose_name=_("Subject"),
        help_text=_("Rendered subject of the notification")
    )
    content = models.TextField(
        verbose_name=_("Content"),
        help_text=_("Rendered content of the notification")
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPE_CHOICES,
        verbose_name=_("Notification type")
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_("Status")
    )
    context_data = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Context data"),
        help_text=_("JSON data used to render the notification")
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name=_("Is read"),
        help_text=_("Whether the user has read this notification")
    )
    read_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Read at"),
        help_text=_("When the notification was marked as read")
    )
    scheduled_for = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Scheduled for"),
        help_text=_("When this notification should be sent")
    )
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Sent at"),
        help_text=_("When this notification was sent")
    )

    class Meta:
        verbose_name = _("Notification")
        verbose_name_plural = _("Notifications")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['status']),
            models.Index(fields=['notification_type']),
            models.Index(fields=['scheduled_for']),
        ]

    def __str__(self):
        return f"Notification for {self.user.username} - {self.subject}"

    def mark_as_read(self):
        """Mark this notification as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])

    def mark_as_sent(self):
        """Mark this notification as sent."""
        self.status = 'sent'
        self.sent_at = timezone.now()
        self.save(update_fields=['status', 'sent_at'])

    def mark_as_delivered(self):
        """Mark this notification as delivered."""
        self.status = 'delivered'
        self.save(update_fields=['status'])

    def mark_as_failed(self, error_message=None):
        """Mark this notification as failed."""
        self.status = 'failed'
        self.save(update_fields=['status'])


class EmailNotification(TimestampMixin, models.Model):
    """
    Extended details for email notifications.
    """
    notification = models.OneToOneField(
        Notification,
        on_delete=models.CASCADE,
        related_name='email_details',
        verbose_name=_("Notification")
    )
    to_email = models.EmailField(
        verbose_name=_("To email"),
        help_text=_("Recipient email address")
    )
    from_email = models.EmailField(
        verbose_name=_("From email"),
        help_text=_("Sender email address")
    )
    cc_emails = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_("CC emails"),
        help_text=_("List of CC email addresses")
    )
    bcc_emails = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_("BCC emails"),
        help_text=_("List of BCC email addresses")
    )
    html_content = models.TextField(
        blank=True,
        verbose_name=_("HTML content"),
        help_text=_("HTML version of the email content")
    )
    attachments = models.JSONField(
        default=list,
        blank=True,
        verbose_name=_("Attachments"),
        help_text=_("List of attachment file paths or URLs")
    )
    delivery_attempts = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Delivery attempts"),
        help_text=_("Number of times delivery was attempted")
    )
    last_delivery_attempt = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Last delivery attempt")
    )
    delivered_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Delivered at"),
        help_text=_("When the email was successfully delivered")
    )
    bounce_reason = models.TextField(
        blank=True,
        verbose_name=_("Bounce reason"),
        help_text=_("Reason for email bounce if delivery failed")
    )
    email_provider_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Email provider ID"),
        help_text=_("ID from email service provider (SendGrid, SES, etc.)")
    )

    class Meta:
        verbose_name = _("Email Notification")
        verbose_name_plural = _("Email Notifications")
        ordering = ['-created_at']

    def __str__(self):
        return f"Email to {self.to_email} - {self.notification.subject}"

    def increment_delivery_attempts(self):
        """Increment the delivery attempts counter."""
        self.delivery_attempts += 1
        self.last_delivery_attempt = timezone.now()
        self.save(update_fields=['delivery_attempts', 'last_delivery_attempt'])


class SMSNotification(TimestampMixin, models.Model):
    """
    Extended details for SMS notifications.
    """
    notification = models.OneToOneField(
        Notification,
        on_delete=models.CASCADE,
        related_name='sms_details',
        verbose_name=_("Notification")
    )
    to_phone = models.CharField(
        max_length=20,
        verbose_name=_("To phone number"),
        help_text=_("Recipient phone number in international format")
    )
    from_phone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name=_("From phone number"),
        help_text=_("Sender phone number or short code")
    )
    delivery_attempts = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Delivery attempts")
    )
    last_delivery_attempt = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Last delivery attempt")
    )
    delivered_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Delivered at")
    )
    sms_provider_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("SMS provider ID"),
        help_text=_("ID from SMS service provider (Twilio, etc.)")
    )
    cost = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        null=True,
        blank=True,
        verbose_name=_("Cost"),
        help_text=_("Cost of sending this SMS")
    )

    class Meta:
        verbose_name = _("SMS Notification")
        verbose_name_plural = _("SMS Notifications")
        ordering = ['-created_at']

    def __str__(self):
        return f"SMS to {self.to_phone} - {self.notification.subject}"

    def increment_delivery_attempts(self):
        """Increment the delivery attempts counter."""
        self.delivery_attempts += 1
        self.last_delivery_attempt = timezone.now()
        self.save(update_fields=['delivery_attempts', 'last_delivery_attempt'])


class PushNotification(TimestampMixin, models.Model):
    """
    Extended details for push notifications.
    """
    notification = models.OneToOneField(
        Notification,
        on_delete=models.CASCADE,
        related_name='push_details',
        verbose_name=_("Notification")
    )
    device_token = models.CharField(
        max_length=255,
        verbose_name=_("Device token"),
        help_text=_("Push notification device token")
    )
    platform = models.CharField(
        max_length=20,
        choices=[
            ('ios', 'iOS'),
            ('android', 'Android'),
            ('web', 'Web'),
        ],
        verbose_name=_("Platform")
    )
    badge_count = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name=_("Badge count"),
        help_text=_("Badge count for the app icon")
    )
    sound = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_("Sound"),
        help_text=_("Sound to play with the notification")
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_("Category"),
        help_text=_("Notification category for grouping")
    )
    action_url = models.URLField(
        blank=True,
        verbose_name=_("Action URL"),
        help_text=_("URL to open when notification is tapped")
    )
    custom_data = models.JSONField(
        default=dict,
        blank=True,
        verbose_name=_("Custom data"),
        help_text=_("Additional custom data for the push notification")
    )
    delivery_attempts = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Delivery attempts")
    )
    last_delivery_attempt = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Last delivery attempt")
    )
    delivered_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name=_("Delivered at")
    )
    push_provider_id = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Push provider ID"),
        help_text=_("ID from push service provider (FCM, APNS, etc.)")
    )

    class Meta:
        verbose_name = _("Push Notification")
        verbose_name_plural = _("Push Notifications")
        ordering = ['-created_at']

    def __str__(self):
        return f"Push to {self.device_token[:20]}... - {self.notification.subject}"

    def increment_delivery_attempts(self):
        """Increment the delivery attempts counter."""
        self.delivery_attempts += 1
        self.last_delivery_attempt = timezone.now()
        self.save(update_fields=['delivery_attempts', 'last_delivery_attempt'])


class UserNotificationPreferences(TimestampMixin, models.Model):
    """
    User preferences for receiving notifications.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_preferences',
        verbose_name=_("User")
    )
    
    # Email preferences
    email_enabled = models.BooleanField(
        default=True,
        verbose_name=_("Email notifications enabled")
    )
    email_order_updates = models.BooleanField(
        default=True,
        verbose_name=_("Order update emails")
    )
    email_promotions = models.BooleanField(
        default=True,
        verbose_name=_("Promotional emails")
    )
    email_security = models.BooleanField(
        default=True,
        verbose_name=_("Security emails")
    )
    
    # SMS preferences
    sms_enabled = models.BooleanField(
        default=False,
        verbose_name=_("SMS notifications enabled")
    )
    sms_order_updates = models.BooleanField(
        default=False,
        verbose_name=_("Order update SMS")
    )
    sms_security = models.BooleanField(
        default=True,
        verbose_name=_("Security SMS")
    )
    
    # Push notification preferences
    push_enabled = models.BooleanField(
        default=True,
        verbose_name=_("Push notifications enabled")
    )
    push_order_updates = models.BooleanField(
        default=True,
        verbose_name=_("Order update push notifications")
    )
    push_promotions = models.BooleanField(
        default=False,
        verbose_name=_("Promotional push notifications")
    )
    
    # In-app notification preferences
    in_app_enabled = models.BooleanField(
        default=True,
        verbose_name=_("In-app notifications enabled")
    )
    
    # Quiet hours
    quiet_hours_enabled = models.BooleanField(
        default=False,
        verbose_name=_("Quiet hours enabled"),
        help_text=_("Don't send notifications during quiet hours")
    )
    quiet_hours_start = models.TimeField(
        null=True,
        blank=True,
        verbose_name=_("Quiet hours start"),
        help_text=_("Start time for quiet hours (user's timezone)")
    )
    quiet_hours_end = models.TimeField(
        null=True,
        blank=True,
        verbose_name=_("Quiet hours end"),
        help_text=_("End time for quiet hours (user's timezone)")
    )
    timezone = models.CharField(
        max_length=50,
        default='UTC',
        verbose_name=_("Timezone"),
        help_text=_("User's timezone for scheduling notifications")
    )

    class Meta:
        verbose_name = _("User Notification Preferences")
        verbose_name_plural = _("User Notification Preferences")

    def __str__(self):
        return f"Notification preferences for {self.user.username}"

    def can_receive_notification(self, notification_type, category=None):
        """
        Check if user can receive a notification of given type and category.
        """
        if notification_type == 'email':
            if not self.email_enabled:
                return False
            if category == 'order_updates' and not self.email_order_updates:
                return False
            if category == 'promotions' and not self.email_promotions:
                return False
            if category == 'security' and not self.email_security:
                return False
        elif notification_type == 'sms':
            if not self.sms_enabled:
                return False
            if category == 'order_updates' and not self.sms_order_updates:
                return False
            if category == 'security' and not self.sms_security:
                return False
        elif notification_type == 'push':
            if not self.push_enabled:
                return False
            if category == 'order_updates' and not self.push_order_updates:
                return False
            if category == 'promotions' and not self.push_promotions:
                return False
        elif notification_type == 'in_app':
            if not self.in_app_enabled:
                return False
        
        return True
