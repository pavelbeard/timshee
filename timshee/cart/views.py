from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from . import serializers, models, cart_logic


# Create your views here.

class CartViewSet(viewsets.ModelViewSet):
    queryset = models.Cart.objects.all()
    authentication_classes = (JWTAuthentication,)
    permission_classes = (AllowAny,)

    def get_serializer_class(self):
        if self.action in ['list', 'get_items']:
            return serializers.CartResponseSerializer
        elif self.action in ['create', 'add_item']:
            return serializers.CartAddSerializer
        elif self.action in ['change_quantity']:
            return serializers.CartUpdateSerializer
        elif self.action in ['delete', 'remove']:
            return serializers.CartRemoveSerializer

    @action(detail=False, methods=['POST'], authentication_classes=[JWTAuthentication], permission_classes=[AllowAny])
    def add_item(self, request, *args, **kwargs):
        serializer = serializers.CartAddSerializer(request.data)
        item_has_added = cart_logic.add_to_cart(request, serializer.data)
        if not item_has_added:
            return Response(
                data={'error': "one user can't order more than 10 items"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['GET'])
    def get_items(self, request):
        cart_manager = cart_logic.CartManager(request)
        cart = cart_manager.get_cart()
        if not cart:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['PUT'])
    def change_quantity(self, request):
        serializer = self.get_serializer(request.data)
        quantity_has_changed = cart_logic.change_quantity(request, serializer.data)
        if quantity_has_changed == 1:
            return Response(
                data={'error': "one user can't order more than 10 items"},
                status=status.HTTP_400_BAD_REQUEST
            )
        elif quantity_has_changed == 2:
            return Response(
                data={'error': "one user can't order less than 0 items"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(status=status.HTTP_200_OK)

    @action(detail=False, methods=['DELETE'])
    def remove(self, request):
        serializer = self.get_serializer(request.data)
        item_has_deleted = cart_logic.remove_item(request, serializer.data)
        if not item_has_deleted:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['DELETE'], authentication_classes=[])
    def clear_cart(self, request):
        delete_result = cart_logic.clear_cart(request)
        if delete_result == 1:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['POST'])
    def add_to_order(self, request):
        result = cart_logic.add_cart_items_to_order(request)
        if not result:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(data={'detail': result}, status=status.HTTP_201_CREATED)
