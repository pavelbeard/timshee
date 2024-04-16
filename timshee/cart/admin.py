from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError

from . import models


# Register your models here.

@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    pass


class CartAdminForm(forms.ModelForm):
    class Meta:
        model = models.CartItem
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()

        existing_item = models.CartItem.objects.get(pk=cleaned_data['item'].id)

        if cleaned_data['quantity'] > existing_item.quantity:
            raise ValidationError("You can't add more items")

        return cleaned_data


@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    form = CartAdminForm

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

