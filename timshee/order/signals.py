from django.db.models.signals import pre_save
from django.dispatch import receiver

from . import models


@receiver(pre_save, sender=models.Address)
def set_as_primary_address(sender, instance, **kwargs):
    if instance.as_primary:
        print("I'm working...")
        models.Address.objects.filter(user=instance.user, as_primary=True).update(as_primary=False)