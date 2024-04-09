from django.contrib import admin
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

from . import models


# Register your models here.

@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    pass


@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if change:
            orig_obj = self.model.objects.get(pk=obj.pk)
            difference = obj.quantity - orig_obj.quantity
        else:
            difference = obj.quantity

        obj.item.quantity -= difference
        obj.item.save()

        obj.save()

    def delete_model(self, request, obj):
        obj.item.quantity += obj.quantity
        obj.item.save()

        obj.delete()

