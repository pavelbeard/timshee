from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from store.models import Item

import uuid


# Create your models here.


class Cart(models.Model):
    user = models.OneToOneField(User, primary_key=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

    class Meta:
        verbose_name = "Cart"
        verbose_name_plural = "Carts"


class CartItem(models.Model):
    # had to write obviously
    id = models.BigAutoField(primary_key=True)
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE, verbose_name="Корзина")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, verbose_name="Товар")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество")
    date_added = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")

    def __str__(self):
        return f"{self.item.name} - {self.quantity} - {self.cart}"

    def total_price(self):
        discount = self.item.discount
        price = self.item.price
        quantity = self.quantity

        if discount == 0:
            return quantity * price
        else:
            return quantity * (price - (price * (discount / 100)))
