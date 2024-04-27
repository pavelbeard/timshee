from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError

from . import models
from .models import AnonymousCartItem


# Register your models here.

def _change_quantity(obj, quantity_in_cart_cleaned, quantity_in_cart_actual):
    if quantity_in_cart_cleaned > quantity_in_cart_actual:
        obj.stock.in_stock -= quantity_in_cart_cleaned
    elif quantity_in_cart_cleaned < quantity_in_cart_actual:
        obj.stock.in_stock += quantity_in_cart_actual

    return obj.stock.save


@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    pass


@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if change:
            quantity_in_cart_cleaned = form.cleaned_data['quantity_in_cart']
            quantity_in_cart_actual = self.model.objects.filter(pk=obj.id).first().quantity_in_cart

            _change_quantity(obj, quantity_in_cart_cleaned, quantity_in_cart_actual)()

            return super().save_model(request, obj, form, change)


@admin.register(models.AnonymousCart)
class AnonymousCartAdmin(admin.ModelAdmin):
    pass


@admin.register(models.AnonymousCartItem)
class AnonymousCartItemAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if change:
            quantity_in_cart_cleaned = form.cleaned_data.get('quantity_in_cart')
            quantity_in_cart_actual = self.model.objects.filter(pk=obj.id).first().quantity_in_cart

        _change_quantity(obj, quantity_in_cart_cleaned, quantity_in_cart_actual)()

        return super().save_model(request, obj, form, change)
