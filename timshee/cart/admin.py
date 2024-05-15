from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.urls import path

from . import models
from .models import AnonymousCartItem


# Register your models here.

@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    pass


@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    # change_form_template = "admin/cart/cart_item_change_form.html"
    readonly_fields = ["quantity_in_cart"]

    # def get_urls(self):
    #     urls = super().get_urls()
    #     custom_urls = [
    #         path("<int:obj_id>/increase/", self.admin_site.admin_view(self.increase), name="authincrease"),
    #         path("<int:obj_id>/decrease/", self.admin_site.admin_view(self.decrease), name="authdecrease"),
    #     ]
    #     return custom_urls + urls

    def increase(self, request, obj_id):
        obj = models.CartItem.objects.get(pk=obj_id)
        obj.increase_quantity_in_cart(quantity=1)
        return redirect("..")

    def decrease(self, request, obj_id):
        obj = models.CartItem.objects.get(pk=obj_id)
        obj.decrease_quantity_in_cart(quantity=1)
        return redirect("..")


@admin.register(models.AnonymousCart)
class AnonymousCartAdmin(admin.ModelAdmin):
    pass


@admin.register(models.AnonymousCartItem)
class AnonymousCartItemAdmin(admin.ModelAdmin):
    # change_form_template = "admin/cart/anonymous_cart_item_change_form.html"
    readonly_fields = ["quantity_in_cart"]

    # def get_urls(self):
    #     urls = super().get_urls()
    #     custom_urls = [
    #         path("<int:obj_id>/increase/", self.admin_site.admin_view(self.increase), name="anonincrease"),
    #         path("<int:obj_id>/decrease/", self.admin_site.admin_view(self.decrease), name="anondecrease"),
    #     ]
    #     return custom_urls + urls

    def increase(self, request, obj_id):
        obj = models.AnonymousCartItem.objects.get(pk=obj_id)
        obj.increase_quantity_in_cart(quantity=1)
        return redirect("..")

    def decrease(self, request, obj_id):
        obj = models.AnonymousCartItem.objects.get(pk=obj_id)
        obj.decrease_quantity_in_cart(quantity=1)
        return redirect("..")
