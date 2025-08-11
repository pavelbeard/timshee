"""
Common model mixins and base classes.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from src.utils.helpers import generate_short_uuid


class TimestampMixin(models.Model):
    """
    Abstract model mixin that provides created_at and updated_at fields.
    """
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created at"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated at"))
    
    class Meta:
        abstract = True


class UUIDMixin(models.Model):
    """
    Abstract model mixin that provides a UUID field.
    """
    uuid = models.CharField(
        max_length=8, 
        unique=True, 
        default=generate_short_uuid,
        verbose_name=_("UUID")
    )
    
    class Meta:
        abstract = True


class UserSessionMixin(models.Model):
    """
    Abstract model mixin for models that can be associated with either a user or session.
    """
    user = models.ForeignKey(
        'auth.User', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        verbose_name=_("User")
    )
    session = models.ForeignKey(
        'sessions.Session', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        verbose_name=_("Session")
    )
    
    class Meta:
        abstract = True
    
    def clean(self):
        """Ensure either user or session is set, but not both."""
        from django.core.exceptions import ValidationError
        
        if not self.user and not self.session:
            raise ValidationError(_("Either user or session must be set"))
        
        if self.user and self.session:
            raise ValidationError(_("Cannot set both user and session"))


class SingletonModel(models.Model):
    """
    Abstract model for singleton instances.
    """
    
    class Meta:
        abstract = True
    
    def save(self, *args, **kwargs):
        """Override save to ensure only one instance exists."""
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        """Prevent deletion of singleton instance."""
        pass
    
    @classmethod
    def get_instance(cls):
        """Get or create the singleton instance."""
        instance, created = cls.objects.get_or_create(pk=1)
        return instance
