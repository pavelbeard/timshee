import logging
import sys

from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.db.models import Sum, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from . import models, serializers, write_serializers, filters

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
        if self.action in ['list', 'retrieve', 'get_item_with_in_stock']:
            return serializers.ItemSerializer
        elif self.action in ["create", "update", "partial_update", "destroy"]:
            return write_serializers.ItemSerializer

    @action(detail=True, methods=["GET"])
    def get_item_with_in_stock(self, request, pk=None):
        item = models.Item.objects.filter(pk=pk)
        if not item:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = self.get_serializer(item.first(), many=False).data
        in_stock = item.values(
            'sizes__value',
            'colors__name',
            'stock__size_id',
            'stock__color_id'
        ).annotate(in_stock=Sum('stock__in_stock'))
        response = Response()
        response.data = data
        response.data['stocks'] = in_stock
        return response


class StockViewSet(viewsets.ModelViewSet):
    queryset = models.Stock.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.StockFilter
    pagination_class = PageNumberPagination

    def get_serializer_class(self):
        if self.action in ['list']:
            return serializers.StockSerializer
        elif self.action in ['get_items_detail']:
            return serializers.ItemSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.StockSerializer

    @action(detail=False, methods=["GET"])
    def get_items_detail(self, request):


        gender = request.query_params.get('item__gender', 'women')
        qs = self.filter_queryset(self.get_queryset())
        qs_general = self.get_queryset().filter(item__gender=gender)
        items = [models.Item.objects.get(pk=item_id) for item_id in qs.values_list('item', flat=True).distinct()]
        total_sizes = qs_general.values('size__value').annotate(total_sizes=Sum('in_stock'))
        total_colors = qs_general.values('color__name').annotate(total_colors=Sum('in_stock'))
        total_types = qs_general.values('item__type__name').annotate(total_types=Sum('in_stock'))
        total_collections = qs_general.values('item__collection__name').annotate(total_collections=Sum('in_stock'))
        total_categories = qs_general.values('item__type__category__name').annotate(total_categories=Sum('in_stock'))

        page = self.paginate_queryset(items)
        serializer = self.get_serializer(page, many=True)
        response = self.get_paginated_response(serializer.data)
        response.data.update({
            'sizes': total_sizes,
            'colors': total_colors,
            'types': total_types,
            'collections': total_collections,
            'categories': total_categories
        })

        return response


class StockImageViewSet(viewsets.ModelViewSet):
    queryset = models.CarouselImage.objects.all()
    serializer_class = serializers.CarouselImageSerializer


class TypeViewSet(viewsets.ModelViewSet):
    queryset = models.Type.objects.all()
    serializer_class = serializers.TypeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer


class CollectionViewSet(viewsets.ModelViewSet):
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.CollectionFilter
    queryset = models.Collection.objects.all().order_by('-id')
    serializer_class = serializers.CollectionSerializer


class SizeViewSet(viewsets.ModelViewSet):
    queryset = models.Size.objects.all()
    serializer_class = serializers.SizeSerializer


class ColorViewSet(viewsets.ModelViewSet):
    queryset = models.Color.objects.all()
    serializer_class = serializers.ColorSerializer


class WishlistViewSet(viewsets.ModelViewSet):
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.WishlistItemFilter
    queryset = models.Wishlist.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]

    def get_serializer_class(self):
        if self.action in ['list', 'get_wishlist_by_user', 'create', 'add_item']:
            return serializers.WishlistSerializer
        elif self.action in ["retrieve", "update", "partial_update", "destroy"]:
            return write_serializers.WishlistSerializer

    @action(detail=False, methods=['POST'])
    def add_item(self, request):
        try:
            session = Session.objects.filter(session_key=request.COOKIES.get('sessionid'))
            user = request.user
            data = request.data
            item_id = data.get('stock__item_id', None)
            size_id, size__value = data.get('stock__size_id', None), data.get('stock__size__value', None)
            color_id, color__name, color__hex = (
                data.get('stock__color_id', None),
                data.get('stock__color__name', None),
                data.get('stock__color__hex', None)
            )
            stock_link = data.get('stock__link', None)

            stock = models.Stock.objects.filter(
                Q(item_id=item_id) &
                (
                        Q(size_id=size_id) |
                        Q(size__value=size__value)
                ) &
                (
                        Q(color_id=color_id) |
                        Q(color__name=color__name) |
                        Q(color__hex=color__hex)
                )
            )

            if not stock.exists():
                return Response(status=status.HTTP_404_NOT_FOUND)

            wl_item = {
                'stock': stock.first(),
                'stock_link': stock_link,
            }

            if session.exists():
                wl_item['session'] = session.first()

            if user.is_authenticated:
                wl_item['user'] = user

            wl_item = models.Wishlist(**wl_item).save()

            data = self.get_serializer(wl_item, many=False).data
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def get_wishlist_by_user(self, request, *args, **kwargs):
        user = None
        session_key = None
        if request.user.is_authenticated:
            user = request.user
        else:
            session_key = request.COOKIES.get('sessionid')
        qs = models.Wishlist.objects.filter(Q(user=user) | Q(session__session_key=session_key))
        data = serializers.WishlistSerializer(qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)
