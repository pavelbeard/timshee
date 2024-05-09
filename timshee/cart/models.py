from auxiliaries.auxiliaries_methods import calculate_discount
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.db import models, IntegrityError

from store.models import Stock


# Create your models here.

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # items = models.ManyToManyField(Stock, through='CartItem')

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

    def increase_quantity_in_cart(self, quantity):
        quantity = int(quantity)

        try:
            if quantity > 0:
                self.quantity_in_cart += quantity
                if self.stock.in_stock > 0:
                    self.stock.in_stock -= quantity
                    self.stock.save()
                    self.save()
                    return True
        except IntegrityError as e:
            return False

    increase_quantity_in_cart.short_description = "Increase quantity in cart"

    def decrease_quantity_in_cart(self, quantity):
        quantity = int(quantity)
        try:
            if self.quantity_in_cart > 0:
                self.quantity_in_cart -= quantity
                self.save()
                self.stock.in_stock += quantity
                self.stock.save()
                return True
        except IntegrityError as e:
            return False

    decrease_quantity_in_cart.short_description = "Decrease quantity in cart"

    def save(self, *args, **kwargs):
        if self.quantity_in_cart == 0:
            self.delete()
        else:
            super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'CartItem'
        verbose_name_plural = 'CartItems'
        unique_together = (('cart', 'stock'),)


class AnonymousCart(models.Model):
    session = models.OneToOneField(Session, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.session)

    class Meta:
        verbose_name = "Anonymous cart"
        verbose_name_plural = "Anonymous carts"


class AnonymousCartItem(models.Model):
    anon_cart = models.ForeignKey(AnonymousCart, on_delete=models.CASCADE)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, blank=True, null=True)
    quantity_in_cart = models.PositiveIntegerField(default=1)
    date_added = models.DateTimeField(auto_now_add=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.stock) + f" [Quantity in cart: {self.quantity_in_cart}]"

    def increase_quantity_in_cart(self, quantity):
        quantity = int(quantity)

        try:
            if quantity > 0:
                self.quantity_in_cart += quantity
                if self.stock.in_stock > 0:
                    self.stock.in_stock -= quantity
                    self.stock.save()
                    self.save()
                    return True
        except IntegrityError as e:
            return False

    def decrease_quantity_in_cart(self, quantity):
        quantity = int(quantity)
        try:
            if self.quantity_in_cart > 0:
                self.quantity_in_cart -= quantity
                self.save()
                self.stock.in_stock += quantity
                self.stock.save()
                return True
        except IntegrityError as e:
            return False

    class Meta:
        verbose_name = 'Anonymous cart item'
        verbose_name_plural = 'Anonymous cart item'
        unique_together = (('anon_cart', 'stock'),)
