"""
Shopping cart views.
"""

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Cart
from .serializers import (
    CartSerializer, 
    AddToCartSerializer,
    UpdateCartItemSerializer,
    RemoveFromCartSerializer
)
from .services import CartService
from src.api.base import BaseViewSet


class CartViewSet(BaseViewSet):
    """
    Shopping cart ViewSet.
    """
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
    
    def get_queryset(self):
        """Filter to current user/session cart only."""
        return Cart.objects.none()  # Override in actions
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current user's/session's cart."""
        cart = CartService.get_or_create_cart(request)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart."""
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            try:
                cart_item = CartService.add_to_cart(
                    request,
                    serializer.validated_data['variant_id'],
                    serializer.validated_data['quantity']
                )
                cart = cart_item.cart
                cart_serializer = CartSerializer(cart)
                return Response(cart_serializer.data, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'])
    def update_item(self, request):
        """Update cart item quantity."""
        serializer = UpdateCartItemSerializer(data=request.data)
        if serializer.is_valid():
            try:
                cart_item = CartService.update_cart_item(
                    request,
                    serializer.validated_data['variant_id'],
                    serializer.validated_data['quantity']
                )
                if cart_item:
                    cart = cart_item.cart
                else:
                    cart = CartService.get_or_create_cart(request)
                
                cart_serializer = CartSerializer(cart)
                return Response(cart_serializer.data)
            except ValueError as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from cart."""
        serializer = RemoveFromCartSerializer(data=request.data)
        if serializer.is_valid():
            success = CartService.remove_from_cart(
                request,
                serializer.validated_data['variant_id']
            )
            if success:
                cart = CartService.get_or_create_cart(request)
                cart_serializer = CartSerializer(cart)
                return Response(cart_serializer.data)
            else:
                return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear all items from cart."""
        CartService.clear_cart(request)
        cart = CartService.get_or_create_cart(request)
        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data)
