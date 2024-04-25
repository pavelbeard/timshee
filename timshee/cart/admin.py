from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError

from . import models


# Register your models here.

@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    pass


@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    pass
