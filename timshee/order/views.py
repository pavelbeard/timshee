import copy

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

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


class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = models.Province.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ProvinceFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProvinceSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.ProvinceSerializer


class AddressViewSet(viewsets.ModelViewSet):
    queryset = models.Address.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.AddressFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AddressSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AddressSerializer

    def update(self, request, *args, **kwargs):
        print(request.data)
        return super().update(request, *args, **kwargs)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = models.Order.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.OrderFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.OrderSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.OrderSerializer

    def create(self, request, *args, **kwargs):
        qs = self.queryset.filter(user=request.user, status="pending_for_pay")
        if len(qs) > 0:
            return Response({
                "detail": "you need to pay for order first", "pending": True,
                "data": write_serializers.OrderSerializer(qs.first(), many=False).data
            }, status=status.HTTP_200_OK)

        return super().create(request, *args, **kwargs)


class AnonymousAddressViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousAddress.objects.all()
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.AnonymousAddressFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousAddressSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousAddressSerializer

    def create(self, request, *args, **kwargs):
        session_key = request.session.session_key

        if session_key is None:
            request.session.create()

        data = copy.copy(request.data)
        data['session'] = session_key

        serializer = write_serializers.AnonymousAddressSerializer(data=data, many=False)

        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AnonymousOrderViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousOrder.objects.all()
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.AnonymousOrderFilter
    authentication_classes = []

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousOrderSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousOrderSerializer

    def create(self, request, *args, **kwargs):
        session_key = request.session.session_key

        if not session_key:
            request.session.create()

        qs = self.queryset.filter(session=session_key, status="pending_for_pay")
        if len(qs) > 0:
            return Response({
                "detail": "you need to pay for order first", "pending": True,
                "data": write_serializers.AnonymousOrderSerializer(qs.first(), many=False).data
            }, status=status.HTTP_200_OK)

        data = copy.copy(request.data)
        data['session'] = session_key
        serializer = self.get_serializer(data=data)

        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = models.ShippingMethod.objects.all()
    permission_classes = (permissions.AllowAny,)
    authentication_classes = []
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ShippingMethodFilter
    serializer_class = serializers.ShippingMethodSerializer
