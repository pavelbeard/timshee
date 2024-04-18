# import logging
# import sys

from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import CartItem

# logging.basicConfig(level=logging.INFO, stream=sys.stdout)
# logger = logging.getLogger(__name__)


@receiver(post_delete, sender=CartItem)
def delete_if_cart_is_empty(sender, instance, **kwargs):
    cart = instance.cart
    if cart.items.count() == 0:
        cart.delete()
