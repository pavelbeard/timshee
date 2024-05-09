from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.sessions.models import Session
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from store import models as store_models
from . import models, serializers, write_serializers, filters
from .models import CartItem


# Create your views here.

def _increase(cart_item_obj, request, pk=None) -> bool:
    quantity = request.data['quantity_in_cart']
    return cart_item_obj.increase_quantity_in_cart(quantity)


def _decrease(cart_item_obj, request) -> bool:
    quantity = request.data['quantity_in_cart']
    return cart_item_obj.decrease_quantity_in_cart(quantity)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = models.CartItem.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.CartItemFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.CartItemSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy", "increase", "decrease"]:
            return write_serializers.CartItemSerializer

    def create(self, request, *args, **kwargs):
        stock_id = request.data['stock']
        obj = self.queryset.filter(stock=stock_id)
        if obj.exists():
            return Response({
                "detail": "That stock already exists",
                "exist": True,
                "id": obj.first().id
            }, status=status.HTTP_200_OK)

        serializer = write_serializers.CartItemSerializer(data=request.data)

        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response({
            "details": "cart item has created",
            "exist": False,
            "id": serializer.data.get('cart')
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['POST'])
    def increase(self, request, pk=None):
        cart_item = self.get_object()
        if _increase(cart_item, request, pk):
            return Response({
                "details": "quantity increased",
                "id": cart_item.id,
                "quantity_in_cart": cart_item.quantity_in_cart
            },
                            status=status.HTTP_200_OK)
        else:
            return Response({"details": "failed to increase quantity, not enough stock"},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def decrease(self, request, pk=None):
        cart_item = self.get_object()
        if _decrease(cart_item, request):
            return Response({
                "details": "quantity decreased",
                "id": cart_item.id,
                "quantity_in_cart": cart_item.quantity_in_cart
            }, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Cart has already been decreased to zero'},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['DELETE'])
    def delete_all(self, request, pk=None):
        items = CartItem.objects.filter(cart__user__id=request.user.id)
        for item in items:
            item.delete()

        return Response({"details": f"Items for {request.user} have been deleted"},
                        status=status.HTTP_204_NO_CONTENT)


class CartViewSet(viewsets.ModelViewSet):
    queryset = models.Cart.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.CartSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.CartSerializer

    def create(self, request, *args, **kwargs):
        user_id = request.data['user']
        cart = self.queryset.filter(user=user_id)

        if cart.exists():
            return Response({
                "detail": "cart already exists",
                "id": cart.first().id,
            }, status=status.HTTP_200_OK)

        serializer = write_serializers.CartSerializer(data={"user": user_id})

        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AnonymousCartItemViewSet(viewsets.ModelViewSet):
    permission_classes = []
    queryset = models.AnonymousCartItem.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_class = filters.AnonymousCartItemFilter

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousCartItemSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousCartItemSerializer

    def create(self, request, *args, **kwargs):
        stock_id = request.data['stock']
        obj = self.queryset.filter(stock=stock_id)
        if obj.exists():
            return Response({
                "details": "That stock already exists",
                "exist": True,
                "id": obj.first().id,
            }, status=status.HTTP_200_OK)

        serializer = write_serializers.AnonymousCartItemSerializer(data=request.data)

        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response({
            "details": "cart item has created",
            "exist": False,
            "id": serializer.data.get('anon_cart'),
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['POST'])
    def increase(self, request, pk=None):
        cart_item = self.get_object()
        if _increase(cart_item, request, pk):
            return Response({
                "details": "quantity increased",
                "id": cart_item.id,
                "quantity_in_cart": cart_item.quantity_in_cart
            },
                            status=status.HTTP_200_OK)
        else:
            return Response({"details": "failed to increase quantity, not enough stock"},
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['POST'])
    def decrease(self, request, pk=None):
        cart_item = self.get_object()
        if _decrease(cart_item, request):
            return Response({
                "details": "quantity decreased",
                "id": cart_item.id,
                "quantity_in_cart": cart_item.quantity_in_cart
            },
                            status=status.HTTP_200_OK)
        else:
            return Response({"details": "Cart has already been decreased to zero"},
                            status=status.HTTP_400_BAD_REQUEST)


class AnonymousCartViewSet(viewsets.ModelViewSet):
    permission_classes = []
    queryset = models.AnonymousCart.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.AnonymousCartSerializer
        elif self.action in ["create", "update", "partial_update", "retrieve", "destroy"]:
            return write_serializers.AnonymousCartSerializer

    def create(self, request, *args, **kwargs):
        session = Session.objects.get(session_key=request.session.session_key)
        obj = self.queryset.filter(session=session)
        if obj.exists():
            return Response({
                "details": "cart already exists",
                "id": obj.first().id},
                status=status.HTTP_200_OK
            )

        serializer = write_serializers.AnonymousCartSerializer(data={"session": session.session_key})

        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)
