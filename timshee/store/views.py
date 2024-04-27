from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination

from cart import models as cart_models
from . import models, serializers, filters


User = get_user_model()


# Create your views here.


class ItemViewSet(viewsets.ModelViewSet):
    queryset = models.Item.objects.all()
    serializer_class = serializers.ItemSerializer
    pagination_class = PageNumberPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.ItemFilter


class StockViewSet(viewsets.ModelViewSet):
    queryset = models.Stock.objects.all()
    serializer_class = serializers.StockSerializer
    pagination_class = PageNumberPagination
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.StockFilter

    @action(detail=True, methods=['post'])
    def put_in_cart(self, request, *args, **kwargs):

        pass


class StockImageViewSet(viewsets.ModelViewSet):
    queryset = models.StockImage.objects.all()
    serializer_class = serializers.StockImageSerializer


class TypeViewSet(viewsets.ModelViewSet):
    queryset = models.Type.objects.all()
    serializer_class = serializers.TypeSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer


class CollectionViewSet(viewsets.ModelViewSet):
    queryset = models.Collection.objects.all()
    serializer_class = serializers.CollectionSerializer


class SizeViewSet(viewsets.ModelViewSet):
    queryset = models.Size.objects.all()
    serializer_class = serializers.SizeSerializer


class ColorViewSet(viewsets.ModelViewSet):
    queryset = models.Color.objects.all()
    serializer_class = serializers.ColorSerializer

