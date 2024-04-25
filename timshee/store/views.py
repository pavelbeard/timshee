from distutils.log import Log

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination

from .filters import ItemFilter, CategoryFilter
from .models import Item, Category, Collection, SizeColor, Type, Logo, RoundImage, Color, Size
from .serializers import (ItemSerializer, CollectionSerializer, CategorySerializer,
                          SizeColorSerializer, TypeSerializer, LogoSerializer,
                          RoundImageSerializer, ColorSerializer, SizeSerializer)


# Create your views here.

class ItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    pagination_class = PageNumberPagination
    filter_backends = [DjangoFilterBackend]
    filterset_class = ItemFilter

    def get_queryset(self):
        queryset = super().get_queryset()

        for item in queryset:
            print(item)
            if item.discount > 0:
                item.price = item.calculate_discount()

        return queryset


class ItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class RoundImageListCreateAPIView(generics.ListCreateAPIView):
    queryset = RoundImage.objects.all()
    serializer_class = RoundImageSerializer
    pagination_class = None


class RoundImageRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = RoundImage.objects.all()
    serializer_class = RoundImageSerializer
    pagination_class = None


class LogoListCreateAPIView(generics.ListCreateAPIView):
    queryset = Logo.objects.all()
    serializer_class = LogoSerializer


class LogoRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = Logo.objects.all()
    serializer_class = LogoSerializer


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


class SizeColorListCreateAPIView(generics.ListCreateAPIView):
    queryset = SizeColor.objects.all()
    serializer_class = SizeColorSerializer
    pagination_class = None


class SizeColorRetrieveDestroyAPIView(generics.RetrieveDestroyAPIView):
    queryset = SizeColor.objects.all()
    serializer_class = SizeColorSerializer


class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None
    filter_backends = [DjangoFilterBackend]
    filterset_class = CategoryFilter


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
