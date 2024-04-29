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
        }


class AnonymousAddressFilter(django_filters.FilterSet):
    class Meta:
        model = models.AnonymousAddress
        fields = {
            'session': ['exact']
        }
