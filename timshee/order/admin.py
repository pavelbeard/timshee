from django.contrib import admin
from django.forms import modelformset_factory
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import path

from . import models
from store import models as store_models

from .models import Province


from .forms import ProvinceFormSet


# Register your models here.




@admin.register(models.Country)
class CountryAdmin(admin.ModelAdmin):
    pass


@admin.register(models.CountryPhoneCode)
class CountryPhoneCodeAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Province)
class ProvinceAdmin(admin.ModelAdmin):
    change_list_template = 'order/templates/provinces_change_list.html'

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('add-multiple/', self.admin_site.admin_view(self.add_multiple_provinces))
        ]
        return custom_urls + urls

    @admin.action(description='Add multiple provinces')
    def add_multiple_provinces(self, request):
        if request.method == 'POST':
            formset = ProvinceFormSet(request.POST)
            if formset.is_valid():
                formset.save()
                self.message_user(request, 'Successfully added multiple provinces')
                return HttpResponseRedirect('../')
        else:
            formset = ProvinceFormSet()

        context = {
            **self.admin_site.each_context(request),
            'formset': formset,
            'opts': self.model._meta,
        }
        return render(request, 'order/templates/create_multiple_provinces.html', context)



@admin.register(models.Continent)
class ContinentAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('province__country__name', 'province__name', 'city', 'postal_code', 'address1', 'address2', )


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ["order_number", "order_item", "returned_item"]
    list_display = ('usrid', 'second_id', 'shipping_address', 'shipping_method',
                    'status', 'refund_reason', 'created_at', 'updated_at')

    def shipping_address(self, obj: models.Order):
        if obj.shipping_address:
            return obj.shipping_address

        return 'NULL'

    def shipping_method(self, obj: models.Order):
        if obj.shipping_method:
            return obj.shipping_method

        return 'NULL'

    def created_at_str(self, obj: models.Order):
        return obj.created_at.strftime("%Y-%m-%d %H:%M:%S")

    def updated_at_str(self, obj: models.Order):
        return obj.updated_at.strftime("%Y-%m-%d %H:%M:%S")

    def usrid(self, obj: models.Order):
        if obj.shipping_address:
            return obj.shipping_address.first_name + ' ' + obj.shipping_address.last_name
        else:
            return 'N/A'

    class OrderItem(admin.TabularInline):
        model = models.OrderItem

    class ReturnedItem(admin.TabularInline):
        model = models.ReturnedItem

    inlines = [OrderItem, ReturnedItem]


@admin.register(models.OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order__second_id', 'item__item__name', 'item__item__price', 'item__size', 'item__color', 'quantity')


@admin.register(models.ReturnedItem)
class ReturnedItemAdmin(admin.ModelAdmin):
    list_display = ('order__second_id', 'item__item__name', 'item__item__price',
                    'item__size', 'item__color', 'quantity', 'refund_reason')


@admin.register(models.ShippingMethod)
class ShippingMethodAdmin(admin.ModelAdmin):
    list_display = ('shipping_name', 'price')
