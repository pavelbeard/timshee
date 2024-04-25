from auxiliaries.auxiliaries_methods import calculate_discount
from django.contrib.auth.models import User
from django.db import models

from store.models import Stock


# Create your models here.

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # items = models.ManyToManyField(Stock)

    def __str__(self):
        return str(self.user)

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, blank=True, null=True)
    quantity_in_cart = models.PositiveIntegerField(default=1)
    date_added = models.DateTimeField(auto_now_add=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.stock) + f" [Quantity in cart: {self.quantity_in_cart}]"

    class Meta:
        verbose_name = 'CartItem'
        verbose_name_plural = 'CartItems'
        unique_together = (('cart', 'stock'),)
