import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


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
    preferred_language = models.CharField(
        max_length=10,
        choices=settings.LANGUAGES,
        default=settings.LANGUAGE_CODE
    )


class DynamicSettings(Singleton):
    on_content_update = models.BooleanField(default=False)
    on_maintenance = models.BooleanField(default=False)


class ResetPasswordCases(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    until = models.DateTimeField(default=timezone.now() + timedelta(hours=3))
    is_active = models.BooleanField(default=True)

    def get_total_seconds(self):
        return self.until

    def __str__(self):
        return f"Reset password for {self.user}"

