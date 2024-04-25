from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError

from . import models


# Register your models here.

@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    pass


class CartAdminForm(forms.ModelForm):
    quantity_in_cart = forms.IntegerField(min_value=1)

    class Meta:
        model = models.CartItem
        fields = '__all__'

    def clean(self):
        return self.cleaned_data
    # def clean(self):
    #     cleaned_data = super().clean()
    #     print("Я РАБОТАЮ ТОЖЕ")
    #     existing_model = self.instance
    #
    #     if cleaned_data.get("quantity_in_cart") > self.instance.item.quantity:
    #         raise ValidationError("You can't add more items")
    #
    #     return cleaned_data


@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    form = CartAdminForm

    # def save_model(self, request, obj, form, change):
    #     if change:
    #         print("CHANGING...")
    #         cleaned_data = form.cleaned_data
    #
    #         if cleaned_data.get('quantity_in_cart') > obj.item.quantity:
    #             print(form)
    #             return
    #
    #         existing_item = models.CartItem.objects.get(pk=obj.pk)
    #         print("EXISTING ITEM AFTER SAVE: ", existing_item.quantity_in_cart)
    #
    #         cleaned_data = form.cleaned_data
    #         print(cleaned_data)
    #
    #     return super().save_model(request, obj, form, change)
        # if change:
        #     print("CHANGED!")
        #     orig_obj = self.model.objects.get(pk=obj.pk)
        #     print(orig_obj)
        #     difference = obj.quantity_in_cart - orig_obj.quantity_in_cart
        # else:
        #     difference = obj.quantity_in_cart
        # 
        # obj.item.quantity -= difference
        # obj.item.save()
        # 
        # obj.save()

    def delete_model(self, request, obj):
        obj.item.quantity = obj.quantity_in_cart
        obj.item.save()

        obj.delete()

