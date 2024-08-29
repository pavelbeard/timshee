from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.db.models import Sum, F, DecimalField
from django.db.models.expressions import result
from django.utils.translation import gettext_lazy as _
from django.db import models

from store.models import Stock

User= get_user_model()


class Cart(models.Model):
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, blank=True, null=True, on_delete=models.CASCADE)
    cart_items = models.ManyToManyField(to="CartItem", related_name="stocks", blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    ordered = models.BooleanField(default=False)

    def __str__(self):
        if self.user:
            cart_id = self.user.email
        elif self.session:
            cart_id = self.session.session_key
        else:
            cart_id = f"{_('Anonymous cart')}: {self.pk}"
        return f"[{_('Cart for')}: {cart_id}]"

    def get_total_price(self):
        result = self.cart_items.annotate(
            total_price=F('stock_item__item__price') * F('quantity')).aggregate(
            total=Sum('total_price', output_field=DecimalField()),
        )['total']
        return result

    def get_total_items(self):
        return self.cart_items.aggregate(total=Sum('quantity'))['total'] or 0

    class Meta:
        verbose_name = _('Cart')
        verbose_name_plural = _('Carts')


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    stock_item = models.ForeignKey(Stock, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def save(self, *args, **kwargs):
        if self.quantity == 0:
            self.delete()
        else:
            return super().save(*args, **kwargs)

    def __str__(self):
        cart_str = ''
        if self.cart.user:
            cart_str += f" {self.cart.user.email} "
        elif self.cart.session:
            cart_str += f" {self.cart.session.session_key}"


        return (f"[{_('CartItem')}: "
                f"{_('id')}={self.pk} {cart_str} "
                f"{_('item')}={self.stock_item.item.name} "
                f"{_('size')}={self.stock_item.size} "
                f"{_('color')}={self.stock_item.color}]")