from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from store import models as store_models
from . import models, serializers


# Create your views here.

def _increase(cart_item_obj, request, pk=None) -> bool:
    quantity = request.data['quantity_in_cart']
    return cart_item_obj.increase_quantity_in_cart(quantity)


def _decrease(cart_item_obj, request) -> bool:
    quantity = request.data['quantity_in_cart']
    return cart_item_obj.decrease_quantity_in_cart(quantity)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = models.CartItem.objects.all()
    serializer_class = serializers.CartItemSerializer

    @action(detail=True, methods=['POST'])
    def increase(self, request, pk=None):
        cart_item = self.get_object()
        if _increase(cart_item, request, pk):
            return Response({"details": "quantity increased"},
                            status=status.HTTP_200_OK)
        else:
            return Response({"details": "failed to increase quantity, not enough stock"},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def decrease(self, request, pk=None):
        cart_item = self.get_object()
        if _decrease(cart_item, request):
            return Response({"details": "quantity decreased"}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Cart has already been decreased to zero'},
                            status=status.HTTP_400_BAD_REQUEST)


class CartViewSet(viewsets.ModelViewSet):
    queryset = models.Cart.objects.all()
    serializer_class = serializers.CartSerializer


class AnonymousCartItemViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousCartItem.objects.all()
    serializer_class = serializers.AnonymousCartItemSerializer

    @action(detail=True, methods=['POST'])
    def increase(self, request, pk=None):
        cart_item = self.get_object()
        if _increase(cart_item, request, pk):
            return Response({"details": "quantity increased"},
                            status=status.HTTP_200_OK)
        else:
            return Response({"details": "failed to increase quantity, not enough stock"},
                            status=status.HTTP_400_BAD_REQUEST)


    @action(detail=True, methods=['POST'])
    def decrease(self, request, pk=None):
        cart_item = self.get_object()
        if _decrease(cart_item, request):
            return Response({"details": "quantity decreased"},
                            status=status.HTTP_200_OK)
        else:
            return Response({"details": "Cart has already been decreased to zero"},
                            status=status.HTTP_400_BAD_REQUEST)


class AnonymousCartViewSet(viewsets.ModelViewSet):
    queryset = models.AnonymousCart.objects.all()
    serializer_class = serializers.AnonymousCartSerializer
