import django_filters

from . import models


class CountryPhoneCodeFilter(django_filters.FilterSet):
    class Meta:
        model = models.CountryPhoneCode
        fields = {
            'country__id': ['exact'],
            'phone_code': ['exact'],
        }



class CityFilter(django_filters.FilterSet):
    class Meta:
        model = models.City
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
            'city__country__name': ['exact', 'icontains', 'istartswith'],
            'city__country__id': ['exact'],
        }


class AnonymousAddressFilter(django_filters.FilterSet):
    class Meta:
        model = models.AnonymousAddress
        fields = {
            'session': ['exact']
        }
