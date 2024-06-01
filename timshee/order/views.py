import copy

from django.forms import model_to_dict
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

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
    permission_classes = (permissions.AllowAny,)
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ['list', "retrieve", "get_addresses_by_user", "get_address_as_primary"]:
            return serializers.AddressSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return write_serializers.AddressSerializer

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user.id
        request.data['session_key'] = request.session.session_key

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user
        request.data['session_key'] = request.session.session_key

        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    def get_addresses_by_user(self, request):
        user = self.request.user
        session_key = request.session.session_key
        qs = None
        if user.is_authenticated:
            qs = models.Address.objects.filter(user=user)
        elif user.is_anonymous:
            qs = models.Address.objects.filter(session_key=session_key)

        if qs.exists():
            data = self.get_serializer(qs, many=True).data
            return Response(data, status=status.HTTP_200_OK)

        return Response({"detail": f"addresses by {user.email} don't exist"},
                        status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_address_as_primary(self, request, *args, **kwargs):
        user = self.request.user
        session_key = request.session.session_key
        qs = None
        if user.is_authenticated:
            qs = models.Address.objects.filter(user=user, as_primary=True)
        elif user.is_anonymous:
            qs = models.Address.objects.filter(session_key=session_key, as_primary=True)

        if qs.exists():
            data = self.get_serializer(qs.first(), many=False).data
            return Response(data, status=status.HTTP_200_OK)

        return Response({"detail": f"primary address by {user.email} doesn't exist"},
                        status=status.HTTP_200_OK)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = models.Order.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.OrderFilter
    permission_classes = (permissions.AllowAny,)
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ['list', "retrieve", "get_orders_by_user", "get_last_order_by_user"]:
            return serializers.OrderSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return write_serializers.OrderSerializer

    def retrieve(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user.id
        request.data['session'] = request.session.session_key

        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data["user"] = request.user.id
        request.data["session"] = request.session.session_key

        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    def get_last_order_by_user(self, request, *args, **kwargs):
        user = self.request.user
        session_key = request.session.session_key
        qs = None
        if user.is_authenticated:
            qs = models.Order.objects.filter(user=user)
        elif user.is_anonymous:
            qs = models.Order.objects.filter(session_key=session_key)

        if qs.exists():
            data = self.get_serializer(qs.last(), many=False).data
            return Response(data, status=status.HTTP_200_OK)

        return Response({"detail": f"last order by {user.email} doesn't exist"},
                        status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_orders_by_user(self, request, *args, **kwargs):
        user = self.request.user
        session_key = request.session.session_key
        qs = None
        if user.is_authenticated:
            qs = models.Order.objects.filter(user=user).exclude(status="created")
        elif user.is_anonymous:
            qs = models.Order.objects.filter(session_key=session_key)

        if qs.exists():
            data = self.get_serializer(qs, many=True).data
            return Response(data, status=status.HTTP_200_OK)

        return Response({"detail": f"orders by {user.email} don't exist"}, status=status.HTTP_200_OK)


class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = models.ShippingMethod.objects.all()
    permission_classes = (permissions.AllowAny,)
    authentication_classes = []
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ShippingMethodFilter
    serializer_class = serializers.ShippingMethodSerializer
