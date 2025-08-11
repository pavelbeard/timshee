"""
Shopping cart models.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _

from src.utils.models import TimestampMixin, UserSessionMixin
from src.apps.catalog.models import ProductVariant


class Cart(UserSessionMixin, TimestampMixin, models.Model):
    """
    Shopping cart model.
    """
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active")
    )

    class Meta:
        verbose_name = _("Shopping Cart")
        verbose_name_plural = _("Shopping Carts")

    def __str__(self):
        user_info = self.user.username if self.user else f"Session: {self.session.session_key[:8]}"
        return f"Cart - {user_info}"

    @property
    def total_items(self):
        """Get total number of items in cart."""
        return sum(item.quantity for item in self.items.all())

    @property
    def total_price(self):
        """Calculate total price of all items in cart."""
        return sum(item.subtotal for item in self.items.all())

    def clear(self):
        """Remove all items from cart."""
        self.items.all().delete()


class CartItem(TimestampMixin, models.Model):
    """
    Individual item in shopping cart.
    """
    cart = models.ForeignKey(
        Cart, 
        on_delete=models.CASCADE, 
        related_name='items',
        verbose_name=_("Cart")
    )
    variant = models.ForeignKey(
        ProductVariant, 
        on_delete=models.CASCADE,
        verbose_name=_("Product variant")
    )
    quantity = models.PositiveIntegerField(
        default=1,
        verbose_name=_("Quantity")
    )

    class Meta:
        verbose_name = _("Cart Item")
        verbose_name_plural = _("Cart Items")
        unique_together = ['cart', 'variant']

    def __str__(self):
        return f"{self.variant} x {self.quantity}"

    @property
    def unit_price(self):
        """Get unit price of the product."""
        return self.variant.product.discounted_price

    @property
    def subtotal(self):
        """Calculate subtotal for this cart item."""
        return self.unit_price * self.quantity

    def increase_quantity(self, amount=1):
        """Increase quantity by specified amount."""
        self.quantity += amount
        self.save()

    def decrease_quantity(self, amount=1):
        """Decrease quantity by specified amount."""
        if self.quantity > amount:
            self.quantity -= amount
            self.save()
        else:
            self.delete()

    def save(self, *args, **kwargs):
        """Override save to ensure quantity is at least 1."""
        if self.quantity < 1:
            self.quantity = 1
        super().save(*args, **kwargs)
