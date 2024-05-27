import django_filters

from . import models


class CountryPhoneCodeFilter(django_filters.FilterSet):
    class Meta:
        model = models.CountryPhoneCode
        fields = {
            'country__id': ['exact'],
            'phone_code': ['exact'],
        }


class ProvinceFilter(django_filters.FilterSet):
    class Meta:
        model = models.Province
        fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'country__name': ['exact', 'icontains', 'istartswith'],
            'country__id': ['exact'],
        }


class AddressFilter(django_filters.FilterSet):
    class Meta:
        model = models.Address
        fields = {
            'user__id': ['exact'],
            'province__country__name': ['exact', 'icontains', 'istartswith'],
            'province__country__id': ['exact'],
            'as_primary': ['exact'],
        }


class AnonymousAddressFilter(django_filters.FilterSet):
    class Meta:
        model = models.AnonymousAddress
        fields = {
            'session': ['exact'],
            'is_last': ['exact'],
        }


class OrderFilter(django_filters.FilterSet):
    class Meta:
        model = models.Order
        fields = {
            "id": ["exact"],
            "user__id": ["exact"],
            "order_number": ["exact"],
            "status": ["exact"],
        }


class AnonymousOrderFilter(django_filters.FilterSet):
    class Meta:
        model = models.AnonymousOrder
        fields = {
            "id": ["exact"],
            "order_number": ["exact"],
            "status": ["exact"],
        }


class ShippingMethodFilter(django_filters.FilterSet):
    class Meta:
        model = models.ShippingMethod
        fields = {
            "id": ["exact"],
        }