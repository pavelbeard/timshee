from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

# from .filters import ItemFilter, CategoryFilter
from .models import Item, Category, Collection, Type, Stock, StockImage, Color, Size
from .serializers import (ItemSerializer, CollectionSerializer, CategorySerializer,
                          TypeSerializer,
                          StockImageSerializer, ColorSerializer, SizeSerializer)


# Create your views here.

class ItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    # filterset_class = ItemFilter


class ItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class StockImageListCreateAPIView(generics.ListCreateAPIView):
    queryset = StockImage.objects.all()
    serializer_class = StockImageSerializer
    pagination_class = None


class StockImageRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = StockImage.objects.all()
    serializer_class = StockImageSerializer
    pagination_class = None


class TypeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer
    pagination_class = None


class TypeRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = Type.objects.all()
    serializer_class = TypeSerializer


class SizeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    pagination_class = None


class SizeRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer


class ColorListCreateAPIView(generics.ListCreateAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    pagination_class = None


class ColorRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer


class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend]
    # filterset_class = CategoryFilter


class CategoryRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CollectionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    pagination_class = None


class CollectionRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
