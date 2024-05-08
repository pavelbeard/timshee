import django_filters

from . import models


class CartItemFilter(django_filters.FilterSet):
    class Meta:
        model = models.CartItem
        fields = {
            "cart__user__id": ["exact"],
            "cart__id": ["exact"],
        }


class AnonymousCartItemFilter(django_filters.FilterSet):
    class Meta:
        model = models.AnonymousCartItem
        fields = {
            "anon_cart": ["exact"]
        }
