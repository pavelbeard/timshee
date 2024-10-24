from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.

PENDING = "pending"
WAITING_FOR_CAPTURE = "waiting_for_capture"
PARTIAL_REFUNDED = "partial_refunded"
REFUNDED = "refunded"
SUCCEEDED = "succeeded"
CANCELLED = "canceled"


class Payment(models.Model):
    STATUS_CHOICES = {
        PENDING: _("PENDING"),
        WAITING_FOR_CAPTURE: _("WAITING_FOR_CAPTURE"),
        PARTIAL_REFUNDED: _("PARTIAL_REFUNDED"),
        REFUNDED: _("REFUNDED"),
        SUCCEEDED: _("SUCCEEDED"),
        CANCELLED: _("CANCELLED"),
    }

    payment_id = models.UUIDField(blank=True, null=True)
    store_order_id = models.CharField(max_length=255)
    store_order_number = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(blank=True, null=True)
    captured_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.store_order_number}"

    class Meta:
        verbose_name = _("Payment")
        verbose_name_plural = _("Payments")
