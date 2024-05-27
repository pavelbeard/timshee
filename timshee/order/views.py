import copy

from django.forms import model_to_dict
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
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
        if self.action in ['list', "retrieve", "get_addresses_by_user", "get_address_as_primary"]:
            return serializers.AddressSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return write_serializers.AddressSerializer

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user = request.user
            request.data['user'] = user.id

            return super().create(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user = request.user
            request.data['user'] = user.id

            return super().update(request, *args, **kwargs)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=["GET"])
    def get_addresses_by_user(self, request):
        user = self.request.user
        if user.is_authenticated:
            qs = models.Address.objects.filter(user=user)

            if qs.exists():
                data = self.get_serializer(qs, many=True).data
                return Response(data, status=status.HTTP_200_OK)

            return Response({"detail": f"addresses by {user.email} don't exist"},
                            status=status.HTTP_200_OK)

        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=["GET"])
    def get_address_as_primary(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            qs = models.Address.objects.filter(user=user)

            if qs.exists():
                data = self.get_serializer(qs.first(), many=False).data
                return Response(data, status=status.HTTP_200_OK)

            return Response({"detail": f"primary address by {user.email} doesn't exist"},
                            status=status.HTTP_200_OK)

        return Response(status=status.HTTP_403_FORBIDDEN)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = models.Order.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.OrderFilter

    def get_serializer_class(self):
        if self.action in ['list', "retrieve", "get_orders_by_user", "get_last_order_by_user"]:
            return serializers.OrderSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return write_serializers.OrderSerializer

    def create(self, request, *args, **kwargs):
        qs = self.queryset.filter(user=request.user, status="pending_for_pay")
        if len(qs) > 0:
            return Response({
                "detail": "you need to pay for order first", "pending": True,
                "data": write_serializers.OrderSerializer(qs.first(), many=False).data
            }, status=status.HTTP_200_OK)

        request.data["user"] = request.user.id

        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            user = request.user
            request.data["user"] = user.id
            # data = serializers.OrderSerializer(request.data, partial=True).data
            
            return super().update(request, *args, **kwargs)
            # return Response(data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=["GET"])
    def get_last_order_by_user(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            qs = models.Order.objects.filter(user=user)

            if qs.exists():
                data = self.get_serializer(qs.first(), many=False).data
                return Response(data, status=status.HTTP_200_OK)

            return Response({"detail": f"last order by {user.email} doesn't exist"},
                            status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=["GET"])
    def get_orders_by_user(self, request, *args, **kwargs):
        user = self.request.user
        if user.is_authenticated:
            qs = models.Order.objects.filter(user=user)

            if qs.exists():
                data = self.get_serializer(qs, many=True).data
                return Response(data, status=status.HTTP_200_OK)

            return Response({"detail": f"orders by {user.email} don't exist"}, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)


class AnonymousAddressViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousAddress.objects.all()
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.AnonymousAddressFilter

    def get_serializer_class(self):
        if self.action in ['list', "update", "retrieve", "get_addresses_by_session", "get_address_is_last"]:
            return serializers.AnonymousAddressSerializer
        elif self.action in ["create", "partial_update", "destroy"]:
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

    @action(detail=False, methods=["GET"])
    def get_addresses_by_session(self, request, *args, **kwargs):
        session_key = request.session.session_key
        if session_key is None:
            return Response({"detail": "session key not found"}, status=status.HTTP_200_OK)

        qs = self.queryset.filter(session=str(session_key))

        if qs.exists():
            data = self.get_serializer(qs, many=True).data
            return Response(data, status=status.HTTP_200_OK)

        return Response({"detail": "addresses by session don't exist"},
                        status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_address_is_last(self, request, *args, **kwargs):
        session_key = request.session.session_key
        qs = self.queryset.filter(session=session_key, is_last=True)

        if qs.exists():
            data = self.get_serializer(qs.first(), many=False).data
            return Response(data, status=status.HTTP_200_OK)

        return Response({"detail": "last address by session don't exist"},
                        status=status.HTTP_200_OK)


class AnonymousOrderViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousOrder.objects.all()
    permission_classes = (permissions.AllowAny,)
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.AnonymousOrderFilter
    authentication_classes = []

    def get_serializer_class(self):
        if self.action in ['list', "retrieve"]:
            return serializers.AnonymousOrderSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
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
