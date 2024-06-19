import copy
import logging

from django.contrib.auth.models import AnonymousUser
from django.forms import model_to_dict
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from . import models, serializers, write_serializers, filters

from order import models as order_models

logger = logging.getLogger(__name__)


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

        serializer = self.get_serializer(data=request.data, many=False)

        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        instance = serializer.save()

        if request.data.get('order_id'):
            order = order_models.Order.objects.get(pk=request.data['order_id'])
            order.shipping_address = self.queryset.get(pk=instance.id)
            order.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user.id
        request.data['session_key'] = request.session.session_key

        if request.data.get('order_id'):
            order = order_models.Order.objects.get(pk=request.data['order_id'])
            order.shipping_address = self.queryset.get(pk=kwargs.get('pk'))
            order.save()

        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    def get_addresses_by_user(self, request):
        try:
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

            return Response({
                "detail": f"addresses by {session_key if isinstance(user, AnonymousUser) else user.email} don't exist"
            }, status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.exception(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["GET"])
    def get_address_as_primary(self, request, *args, **kwargs):
        try:
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

            return Response({"detail": f"primary address by {
            session_key if isinstance(user, AnonymousUser) else user.email
            } doesn't exist"},
                            status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        request.data['session_key'] = request.session.session_key

        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        data = copy.copy(request.data)
        if request.user.is_authenticated:
            data["user"] = request.user.id
        data["session_key"] = request.session.session_key
        data["updated_at"] = timezone.now()

        if data.get('status'):
            if data['status'] == "processing":
                from stuff import services
                services.send_email(request, kwargs['pk'], 'processing')

        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=["GET"])
    def get_last_order_by_user(self, request, *args, **kwargs):
        try:
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

            return Response({"detail": f"last order by {
            session_key if isinstance(user, AnonymousUser) else user.email
            } doesn't exist"},
                            status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["GET"])
    def get_orders_by_user(self, request, *args, **kwargs):
        try:
            user = self.request.user
            session_key = request.session.session_key
            qs = None
            if user.is_authenticated:
                qs = models.Order.objects.filter(user=user).exclude(status="created").order_by('-created_at')
            elif user.is_anonymous:
                qs = models.Order.objects.filter(session_key=session_key).order_by('-created_at')

            if qs.exists():
                data = self.get_serializer(qs, many=True).data
                return Response(data, status=status.HTTP_200_OK)

            return Response({"detail": f"orders by {
            session_key if isinstance(user, AnonymousUser) else user.email
            } don't exist"}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.exception(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = models.ShippingMethod.objects.all()
    permission_classes = (permissions.AllowAny,)
    authentication_classes = []
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ShippingMethodFilter
    serializer_class = serializers.ShippingMethodSerializer
