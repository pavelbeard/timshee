from django.contrib import admin

from . import models
from store import models as store_models


# Register your models here.

@admin.register(models.Continent)
class ContinentAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Country)
class CountryAdmin(admin.ModelAdmin):
    pass


@admin.register(models.CountryPhoneCode)
class CountryPhoneCodeAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Province)
class ProvinceAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Address)
class AddressAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ["order_number", "order_item"]

    class OrderItem(admin.TabularInline):
        model = models.OrderItem

    inlines = [OrderItem]


@admin.register(models.OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    pass


@admin.register(models.ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    pass
