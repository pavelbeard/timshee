from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions

from . import models, serializers, write_serializers, filters


# Create your views here.

class CountryViewSet(viewsets.ModelViewSet):
    queryset = models.Country.objects.all()
    serializer_class = serializers.CountrySerializer


class CountryPhoneCodeViewSet(viewsets.ModelViewSet):
    queryset = models.CountryPhoneCode.objects.all()
    serializer_class = serializers.CountryPhoneCodeSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.CountryPhoneCodeFilter


class CityViewSet(viewsets.ModelViewSet):
    queryset = models.City.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.CityFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.CitySerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.CitySerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = models.Address.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.AddressFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AddressSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AddressSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = models.Order.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.OrderSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.OrderSerializer


class AnonymousAddressViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousAddress.objects.all()
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend,)
    filterset = filters.AnonymousAddressFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousAddressSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousAddressSerializer


class AnonymousOrderViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousOrder.objects.all()
    permission_classes = (permissions.AllowAny,)
    # filter_backends = (DjangoFilterBackend,)
    # filterset = filters.AnonymousOrderFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousOrderSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousOrderSerializer
