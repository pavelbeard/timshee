"""
Authentication models.
"""

from django.contrib.auth.models import User
from django.db import models
from django.utils.translation import gettext_lazy as _

from src.utils.models import TimestampMixin, UUIDMixin, SingletonModel


class UserProfile(TimestampMixin, models.Model):
    """
    Extended user profile model.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        verbose_name=_("User")
    )
    email_confirmed = models.BooleanField(
        default=False,
        verbose_name=_("Email confirmed")
    )
    preferred_language = models.CharField(
        max_length=5,
        choices=[
            ('en', _('English')),
            ('es', _('Spanish')),
            ('ru', _('Russian')),
        ],
        default='en',
        verbose_name=_("Preferred language")
    )
    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name=_("Phone number")
    )
    
    class Meta:
        verbose_name = _("User Profile")
        verbose_name_plural = _("User Profiles")
    
    def __str__(self):
        return f"{self.user.username} - Profile"


class EmailToken(TimestampMixin, UUIDMixin, models.Model):
    """
    Token for email verification and password reset.
    """
    TOKEN_TYPES = [
        ('email_verification', _('Email Verification')),
        ('password_reset', _('Password Reset')),
    ]
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name=_("User")
    )
    token_type = models.CharField(
        max_length=20,
        choices=TOKEN_TYPES,
        verbose_name=_("Token type")
    )
    is_used = models.BooleanField(
        default=False,
        verbose_name=_("Is used")
    )
    expires_at = models.DateTimeField(
        verbose_name=_("Expires at")
    )
    
    class Meta:
        verbose_name = _("Email Token")
        verbose_name_plural = _("Email Tokens")
    
    def __str__(self):
        return f"{self.user.username} - {self.token_type}"


class DynamicSettings(SingletonModel):
    """
    Global application settings.
    """
    on_content_update = models.BooleanField(
        default=False,
        verbose_name=_("Content update mode")
    )
    on_maintenance = models.BooleanField(
        default=False,
        verbose_name=_("Maintenance mode")
    )
    experimental = models.BooleanField(
        default=False,
        verbose_name=_("Experimental features")
    )
    international = models.BooleanField(
        default=False,
        verbose_name=_("International shipping")
    )
    compress_pics_on_server = models.BooleanField(
        default=False,
        verbose_name=_("Compress pictures on server")
    )
    items_for_genders = models.BooleanField(
        default=False,
        verbose_name=_("Items categorized by gender")
    )
    
    class Meta:
        verbose_name = _("Dynamic Settings")
        verbose_name_plural = _("Dynamic Settings")
    
    def __str__(self):
        return "Application Settings"


class OwnerData(SingletonModel):
    """
    Store owner information.
    """
    full_name = models.CharField(
        max_length=255,
        verbose_name=_("Full name")
    )
    tax_number = models.CharField(
        max_length=255,
        verbose_name=_("Tax number")
    )
    contact_number = models.CharField(
        max_length=255,
        verbose_name=_("Contact number")
    )
    email = models.EmailField(
        verbose_name=_("Email")
    )
    
    class Meta:
        verbose_name = _("Owner Data")
        verbose_name_plural = _("Owner Data")
    
    def __str__(self):
        return self.full_name
