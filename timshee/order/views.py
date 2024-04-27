from rest_framework import viewsets, permissions

from . import models, serializers, write_serializers


# Create your views here.

class CountryViewSet(viewsets.ModelViewSet):
    queryset = models.Country.objects.all()
    serializer_class = serializers.CountrySerializer


class CountryPhoneCodeViewSet(viewsets.ModelViewSet):
    queryset = models.CountryPhoneCode.objects.all()
    serializer_class = serializers.CountryPhoneCodeSerializer


class CityViewSet(viewsets.ModelViewSet):
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = models.Address.objects.all()

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

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousAddressSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousAddressSerializer


class AnonymousOrderViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousOrder.objects.all()
    permission_classes = (permissions.AllowAny,)

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousOrderSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousOrderSerializer
