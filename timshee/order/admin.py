from django.contrib import admin
from django.db.models import Max

from . import models


# Register your models here.

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
    readonly_fields = ["order_number"]


@admin.register(models.AnonymousAddress)
class AnonymousAddressAdmin(admin.ModelAdmin):
    pass


@admin.register(models.AnonymousOrder)
class AnonymousOrderAdmin(admin.ModelAdmin):
    readonly_fields = ["order_number"]


@admin.register(models.ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    pass
