from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination

from cart import models as cart_models
from . import models, serializers, write_serializers, filters


User = get_user_model()


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
    queryset = models.Collection.objects.all()
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


