from django.db import models


# Create your models here.

class Payment(models.Model):
    STATUS_CHOICES = (
        ("pending", "PENDING"),
        ("waiting_for_capture", "WAITING_FOR_CAPTURE"),
        ("partial_refunded", "PARTIAL_REFUNDED"),
        ("refunded", "REFUNDED"),
        ("succeeded", "SUCCEEDED"),
        ("canceled", "CANCELLED"),
    )

    payment_id = models.UUIDField(blank=True, null=True)
    store_order_id = models.CharField(max_length=255)
    store_order_number = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_CHOICES[0][0])
    created_at = models.DateTimeField(blank=True, null=True)
    captured_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.store_order_number}"

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
