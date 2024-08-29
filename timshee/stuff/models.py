from django.conf import settings
from django.contrib.auth.models import User, AbstractUser, Group, Permission
from django.db import models
from django.utils.translation import gettext_lazy as _
from shortuuid.django_fields import ShortUUIDField

from auxiliaries.auxiliaries_methods import get_until_time


class Singleton(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super(Singleton, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
    email_confirmed = models.BooleanField(default=False)
    preferred_language = models.CharField(
        max_length=10,
        choices=settings.LANGUAGES,
        default=settings.LANGUAGE_CODE
    )


class DynamicSettings(Singleton):
    on_content_update = models.BooleanField(default=False)
    on_maintenance = models.BooleanField(default=False)
    experimental = models.BooleanField(default=False)

    class Meta:
        verbose_name = _('Dynamic Settings')
        verbose_name_plural = _('Dynamic Settings')


class OwnerData(Singleton):
    full_name = models.CharField(max_length=255)
    tax_number = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=255)
    email = models.CharField(max_length=255)

    class Meta:
        verbose_name = _('Owner Data')
        verbose_name_plural = _('Owner Data')


class ResetPasswordCase(models.Model):
    uuid = ShortUUIDField(primary_key=True, length=16, max_length=32, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    until = models.DateTimeField(default=get_until_time)
    is_active = models.BooleanField(default=True)

    def get_total_seconds(self):
        return self.until

    def __str__(self):
        return f"{_('Reset password for')}{self.user}"


class EmailToken(models.Model):
    uuid = ShortUUIDField(length=16, max_length=128, editable=False)
    for_email = models.EmailField(unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    until = models.DateTimeField(default=get_until_time(hours=3))
    is_active = models.BooleanField(default=True)

    def get_total_seconds(self):
        return self.until

    def __str__(self):
        return _(f"Email verification token for {self.user}")