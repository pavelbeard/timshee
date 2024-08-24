from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.db import models

from store.models import Stock

User= get_user_model()


class Cart(models.Model):
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, blank=True, null=True, on_delete=models.CASCADE)
    cart_items = models.ManyToManyField(to="CartItem", related_name="stocks", blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    total_items = models.PositiveIntegerField(default=0)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    ordered = models.BooleanField(default=False)

    def __str__(self):
        if self.user:
            cart_id = self.user.email
        elif self.session:
            cart_id = self.session.session_key
        else:
            cart_id = f"Anonymous cart: {self.pk}"
        return f"[Cart for: {cart_id}]"


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


        return (f"[CartItem: "
                f"id={self.pk} {cart_str} "
                f"item={self.stock_item.item.name} "
                f"size={self.stock_item.size} "
                f"color={self.stock_item.color}]")