from django.contrib import admin

from . import models


# Register your models here.

@admin.register(models.Country)
class CountryAdmin(admin.ModelAdmin):
    pass


@admin.register(models.CountryPhoneCode)
class CountryPhoneCodeAdmin(admin.ModelAdmin):
    pass


@admin.register(models.City)
class CityAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Address)
class AddressAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    pass


@admin.register(models.AnonymousAddress)
class AnonymousAddressAdmin(admin.ModelAdmin):
    pass


@admin.register(models.AnonymousOrder)
class AnonymousOrderAdmin(admin.ModelAdmin):
    pass
