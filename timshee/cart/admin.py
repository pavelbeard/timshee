# Register your models here.
from django.contrib import admin

from . import models

@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    class CartItemInline(admin.TabularInline):
        model = models.CartItem

    inlines = [CartItemInline]