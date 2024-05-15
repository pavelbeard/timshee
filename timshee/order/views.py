from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
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
    authentication_classes = []

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousOrderSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousOrderSerializer


class CheckPendingForPay(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user = request.user
            is_not_there_any_pending = (
                any(x.status != "pending_for_pay" for x in models.Order.objects.filter(user=user))
            )
            return Response({"is_not_there_any_pending": is_not_there_any_pending}, status=status.HTTP_200_OK)
        else:
            session_key = request.session.session_key or request.GET.get("sessionKey")
            print(request)
            session = Session.objects.get(session_key=session_key)
            is_not_there_any_pending = (
                any(x.status != "pending_for_pay" for x in models.AnonymousOrder.objects.filter(session=session))
            )
            return Response({"is_not_there_any_pending": is_not_there_any_pending}, status=status.HTTP_200_OK)
