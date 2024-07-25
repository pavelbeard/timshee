import json
import logging
import sys

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db.models import Sum, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination

from cart import models as cart_models
from rest_framework.response import Response
from rest_framework_simplejwt import authentication

from . import models, serializers, write_serializers, query_serializers, filters

User = get_user_model()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)

# Create your views here.


class ItemViewSet(viewsets.ModelViewSet):
    queryset = models.Item.objects.all()
    pagination_class = PageNumberPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ItemFilter

    def get_serializer_class(self):
        if self.action in ['list', "retrieve"]:
            return serializers.ItemSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return write_serializers.ItemSerializer

    def list(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())

        total_sizes = qs.values('stock__size__value').annotate(total_sizes=Sum('stock__in_stock'))
        total_colors = qs.values('stock__color__name').annotate(total_colors=Sum('stock__in_stock'))
        total_types = qs.values('type__name').annotate(total_types=Sum('stock__in_stock'))

        sizes_serializer = query_serializers.SizeSerializer(total_sizes, many=True).data
        colors_serializer = query_serializers.ColorSerializer(total_colors, many=True).data
        types_serializer = query_serializers.TypeSerializer(total_types, many=True).data

        page = self.paginate_queryset(qs)

        serializer = self.get_serializer(page, many=True)
        response = self.get_paginated_response(serializer.data)
        response.data.update({
            'total_sizes': sizes_serializer,
            'total_colors': colors_serializer,
            'total_types': types_serializer
        })
        return response


class StockViewSet(viewsets.ModelViewSet):
    queryset = models.Stock.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.StockFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.StockSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.StockSerializer


class StockImageViewSet(viewsets.ModelViewSet):
    queryset = models.CarouselImage.objects.all()
    serializer_class = serializers.CarouselImageSerializer


class TypeViewSet(viewsets.ModelViewSet):
    queryset = models.Type.objects.all()
    serializer_class = serializers.TypeSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = models.Collection.objects.all().order_by('-id')
    serializer_class = serializers.CollectionSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class SizeViewSet(viewsets.ModelViewSet):
    queryset = models.Size.objects.all()
    serializer_class = serializers.SizeSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class ColorViewSet(viewsets.ModelViewSet):
    queryset = models.Color.objects.all()
    serializer_class = serializers.ColorSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class WishlistViewSet(viewsets.ModelViewSet):
    queryset = models.Wishlist.objects.all()
    authentication_classes = []

    def get_serializer_class(self):
        if self.action in ['list', 'get_wishlist_by_user', 'create']:
            return serializers.WishlistSerializer
        elif self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return write_serializers.WishlistSerializer

    def create(self, request, *args, **kwargs):
        try:
            if request.user.is_authenticated:
                request.data['user'] = request.user.id

            request.data['session_key'] = request.session.session_key
            item_id, size_id, color_id = request.data['stock']['item_id'], \
                request.data['stock']['size_id'], request.data['stock']['color_id']
            stock = models.Stock.objects.get(
                item_id=item_id, size_id=size_id, color_id=color_id
            )

            request.data['stock'] = stock.id

            instance = models.Wishlist.objects.create(
                session_key=request.session.session_key,
                stock=stock,
                stock_link=request.data['stock_link']
            )

            if not isinstance(request.user, AnonymousUser):
                instance.user = request.user
                instance.save()

            data = self.get_serializer(instance, many=False).data

            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def get_wishlist_by_user(self, request, *args, **kwargs):
        user = None
        session_key = None
        if request.user.is_authenticated:
            user = request.user.id
        else:
            session_key = request.COOKIES.get('session_key')
        qs = models.Wishlist.objects.filter(Q(user=user) | Q(session_key=session_key))
        data = serializers.WishlistSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)



