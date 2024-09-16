import logging

from django.contrib.sessions.models import Session
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from stuff.permissions import HasAPIKey
from . import models, serializers, write_serializers, filters, order_logic

logger = logging.getLogger(__name__)


# Create your views here.

class CountryViewSet(viewsets.ModelViewSet):
    authentication_classes = []
    permission_classes = [HasAPIKey]
    queryset = models.Country.objects.all()
    serializer_class = serializers.CountrySerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.CountryFilter


class CountryPhoneCodeViewSet(viewsets.ModelViewSet):
    authentication_classes = []
    permission_classes = [HasAPIKey]
    queryset = models.CountryPhoneCode.objects.all()
    serializer_class = serializers.CountryPhoneCodeSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.CountryPhoneCodeFilter


class ProvinceViewSet(viewsets.ModelViewSet):
    authentication_classes = []
    permission_classes = [HasAPIKey]
    queryset = models.Province.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ProvinceFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.ProvinceSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.ProvinceSerializer


class AddressViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [HasAPIKey]
    queryset = models.Address.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.AddressFilter

    def get_serializer_class(self):
        if self.action in ['list', "retrieve", "get_addresses_by_user", "get_address_as_primary"]:
            return serializers.AddressSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return write_serializers.AddressSerializer

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user.id

        request.data['session_id'] = Session.objects.filter(session_key=request.COOKIES.get('sessionid'))

        serializer = self.get_serializer(data=request.data, many=False)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        instance = serializer.save()

        if request.data.get('order_id'):
            order = models.Order.objects.get(pk=request.data['order_id'])
            order.shipping_address = self.queryset.get(pk=instance.id)
            order.save()
            del request.data['order_id']

        return Response(serializers.AddressSerializer(instance).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user.id
        request.data['session_key'] = request.COOKIES.get('sessionid')

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if request.data.get('order_id'):
            order = models.Order.objects.get(pk=request.data['order_id'])
            order.shipping_address = self.queryset.get(pk=kwargs.get('pk'))
            order.save()
            del request.data['order_id']

        return Response(serializers.AddressSerializer(instance).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_addresses_by_user(self, request):
        try:
            user = self.request.user
            session_key = request.COOKIES.get('sessionid')

            qs = None
            if user.is_authenticated:
                qs = models.Address.objects.filter(Q(user=user))
            elif user.is_anonymous:
                qs = models.Address.objects.filter(Q(session__session_key=session_key))

            if not qs.exists():
                return Response(status=status.HTTP_404_NOT_FOUND)

            data = self.get_serializer(qs, many=True).data
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.exception(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["GET"])
    def get_address_as_primary(self, request, *args, **kwargs):
        try:
            user = self.request.user
            session_key = request.COOKIES.get('sessionid')
            qs = None
            if user.is_authenticated:
                qs = models.Address.objects.filter(Q(user=user) & Q(as_primary=True))
            elif user.is_anonymous:
                qs = models.Address.objects.filter(Q(session__session_key=session_key) & Q(as_primary=True))

            response = Response()

            if not qs.exists():
                response.status = status.HTTP_404_NOT_FOUND
                return response

            data = self.get_serializer(qs.first(), many=False).data
            response.data = data
            response.status = status.HTTP_200_OK
            return response
        except Exception as e:
            logger.exception(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [HasAPIKey]
    authentication_classes = [JWTAuthentication]
    queryset = models.Order.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.OrderFilter
    lookup_field = 'second_id'

    def get_serializer_class(self):
        if self.action in ['list', "retrieve", "get_orders_by_user", "get_last_order_by_user"]:
            return serializers.OrderSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return write_serializers.OrderSerializer
        elif self.action in ["update_shipping_info"]:
            return write_serializers.OrderUpdateShippingInfoSerializer

    def retrieve(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            request.data['user'] = request.user.id
        response = super().retrieve(request, *args, **kwargs)
        return response

    @action(detail=True, methods=["PATCH"])
    def update_shipping_info(self, request, *args, **kwargs):
        data = order_logic.update_shipping_info(request, self.get_serializer, **kwargs)
        response = Response(data, status=status.HTTP_200_OK)
        return response

    @action(detail=False, methods=["GET"])
    def get_last_order_by_user(self, request, *args, **kwargs):
        try:
            user = self.request.user
            session_key = request.COOKIES.get('sessionid')
            qs = None
            if user.is_authenticated:
                qs = models.Order.objects.filter(user=user)
            elif user.is_anonymous:
                qs = models.Order.objects.filter(session__session_key=session_key)

            if not qs.exists():
                response = Response(status=status.HTTP_404_NOT_FOUND)
                return response

            data = self.get_serializer(qs.last(), many=False).data
            response = Response(status=status.HTTP_200_OK)
            response.data = data
            return response
        except Exception as e:
            logger.exception(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["GET"])
    def get_orders_by_user(self, request, *args, **kwargs):
        try:
            user = self.request.user
            session_key = request.COOKIES.get('sessionid')
            o = models.Order
            included_statuses = [o.CANCELLED, o.PROCESSING, o.DELIVERED, o.COMPLETED, o.REFUNDED, o.PARTIAL_REFUNDED]
            qs = None
            if user.is_authenticated:
                qs = models.Order.objects.filter(
                    Q(user=user) & Q(status__in=included_statuses)
                ).order_by('-created_at')
            elif user.is_anonymous:
                qs = models.Order.objects.filter(
                    Q(session__session_key=session_key) & Q(status__in=included_statuses)
                ).order_by('-created_at')

            response = Response()

            if not qs.exists():
                response.status = status.HTTP_404_NOT_FOUND
                return response

            data = self.get_serializer(qs, many=True).data
            response.data = data
            response.status = status.HTTP_200_OK
            return response
        except Exception as e:
            logger.exception(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ShippingMethodViewSet(viewsets.ModelViewSet):
    authentication_classes = []
    permission_classes = [HasAPIKey]
    queryset = models.ShippingMethod.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ShippingMethodFilter
    serializer_class = serializers.ShippingMethodSerializer
