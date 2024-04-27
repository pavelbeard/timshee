import django_filters

from . import models


class AddressFilter(django_filters.FilterSet):
    class Meta:
        model = models.Address
        fields = {
            'user__id': ['exact'],
        }


class AnonymousAddressFilter(django_filters.FilterSet):
    class Meta:
        model = models.AnonymousAddress
        fields = {
            'session__id': ['exact']
        }
