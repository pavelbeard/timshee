from django.contrib import admin
from .models import Country, City, Address, Order, CountryPhoneCode


# Register your models here.

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    pass


@admin.register(CountryPhoneCode)
class CountryPhoneCodeAdmin(admin.ModelAdmin):
    pass


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    pass


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    pass


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    pass
