import json

from django.contrib.auth import get_user_model
from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination

from cart import models as cart_models
from rest_framework.response import Response

from . import models, serializers, write_serializers, query_serializers, filters

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

    # def list(self, request, *args, **kwargs):
    #     response = super().list(request, *args, **kwargs)
    #     if response.status_code == status.HTTP_200_OK:
    #         for type_ in self.queryset:
    #             data_type_obj = list(filter(lambda obj: obj['id'] == type_.id, response.data))[0]
    #             data_type_obj.update(type_.item_set.aggregate(total=Sum('stock__in_stock')))
    #
    #     return response


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

    # def list(self, request, *args, **kwargs):
    #     response = super().list(request, *args, **kwargs)
    #     if response.status_code == status.HTTP_200_OK:
    #         for size in self.queryset:
    #             data_size_obj = list(filter(lambda obj: obj['id'] == size.id, response.data))[0]
    #             data_size_obj.update(size.stock_set.aggregate(total=Sum('in_stock')))
    #
    #     return response


class ColorViewSet(viewsets.ModelViewSet):
    queryset = models.Color.objects.all()
    serializer_class = serializers.ColorSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    # def list(self, request, *args, **kwargs):
    #     response = super().list(request, *args, **kwargs)
    #     if response.status_code == status.HTTP_200_OK:
    #         for color in self.queryset:
    #             data_color_obj = list(filter(lambda obj: obj['id'] == color.id, response.data))[0]
    #             data_color_obj.update(color.stock_set.aggregate(total=Sum('in_stock')))
    #
    #     return response
