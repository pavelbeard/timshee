from datetime import timedelta

from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.utils import timezone

from . import models


@receiver(pre_save, sender=models.Address)
def set_as_primary_address(sender, instance, **kwargs):
    if instance.as_primary:
        print("I'm working...")
        models.Address.objects.filter(user=instance.user, as_primary=True).update(as_primary=False)


@receiver(pre_save, sender=models.Order)
def set_orders_as_non_refundable(sender, instance, **kwargs):
    seven_days_ago = timezone.now() - timedelta(days=7)
    filtered_orders = models.Order.objects.filter(created_at__lt=seven_days_ago.date())
    filtered_orders.update(non_refundable=True)

