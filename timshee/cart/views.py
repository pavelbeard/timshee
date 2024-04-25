from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from store.models import Item
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


# Create your views here.

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()

    # def list(self, request):
    #     queryset = CartItem.objects.all()
    #     serializer = CartItemSerializer(queryset, many=True)
    #     return Response(serializer.data)
    #
    # def create(self, request):
    #     item_color_size = request.data.get('item_color_size')
    #     quantity = int(request.data.get('quantity', 1))
    #     CartItem.add_item(request.user, item_color_size, quantity)
    #     return Response(status=status.HTTP_201_CREATED)
    #
    # def retrieve(self, request, pk=None):
    #     queryset = CartItem.objects.all()
    #     cart_item = get_object_or_404(queryset, pk=pk)
    #     serializer = CartItemSerializer(cart_item)
    #     return Response(serializer.data)


class CartListCreateAPIView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    pagination_class = None


class CartRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    pagination_class = None


class CartItemListCreateAPIView(generics.ListCreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    pagination_class = None


class CartItemRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    pagination_class = None

    # def put(self, request, *args, **kwargs):
    #     return self.partial_update(request, *args, **kwargs)
