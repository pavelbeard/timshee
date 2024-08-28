import django
from django.contrib.auth import user_logged_in
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db.models.signals import post_save
from django.dispatch import receiver

from . import models
from cart.models import Cart
from order.models import Order, Address
from store.models import Wishlist


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    try:
        if created:
            models.UserProfile.objects.create(user=instance)
        instance.userprofile.save()
    except django.contrib.auth.models.User.userprofile.RelatedObjectDoesNotExist:
        pass
    except IntegrityError:
        pass

@receiver(user_logged_in)
def transfer_anonymous_data(sender, request, user, **kwargs):
    session_key = request.COOKIES.get('sessionid')
    # cart transfer
    if session_key:
        cart = Cart.objects.filter(session__session_key=session_key).first()
        if cart:
            user_cart, created = Cart.objects.get_or_create(user=user)
            if not created:
                user_cart_items = user_cart.cart_items.all()
                cart_items = cart.cart_items.all()

                for cart_item in cart_items:
                    if not cart_item in user_cart_items:
                        user_cart.cart_items.add(cart_item)

                user_cart.save()
            else:
                user_cart.cart_items.set(cart.cart_items.all())
                user_cart.save()

            cart.delete()

        wishlists = Wishlist.objects.filter(session__session_key=session_key)
        for wishlist in wishlists:
            wishlist.user = user
            wishlist.session = None
            wishlist.save()

        addresses = Address.objects.filter(session__session_key=session_key)
        for address in addresses:
            address.user = user
            address.session = None
            address.save()

        orders = Order.objects.filter(session__session_key=session_key)
        for order in orders:
            order.user = user
            order.session = None
            order.save()

