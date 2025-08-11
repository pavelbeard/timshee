"""
Shopping serializers.
"""

from rest_framework import serializers

from .models import Cart, CartItem
from src.apps.catalog.models import ProductVariant
from src.apps.catalog.serializers import ProductVariantSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """
    Cart item serializer.
    """
    variant = ProductVariantSerializer(read_only=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = CartItem
        fields = ['id', 'variant', 'quantity', 'unit_price', 'subtotal', 'created_at']


class CartSerializer(serializers.ModelSerializer):
    """
    Cart serializer.
    """
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'total_price', 'created_at']


class AddToCartSerializer(serializers.Serializer):
    """
    Serializer for adding items to cart.
    """
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate_variant_id(self, value):
        """Validate that variant exists and is active."""
        try:
            variant = ProductVariant.objects.get(id=value, is_active=True)
            if not variant.is_in_stock:
                raise serializers.ValidationError("Product variant is out of stock")
            return value
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError("Product variant not found")


class UpdateCartItemSerializer(serializers.Serializer):
    """
    Serializer for updating cart item quantity.
    """
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=0)
    
    def validate_variant_id(self, value):
        """Validate that variant exists."""
        try:
            ProductVariant.objects.get(id=value)
            return value
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError("Product variant not found")


class RemoveFromCartSerializer(serializers.Serializer):
    """
    Serializer for removing items from cart.
    """
    variant_id = serializers.IntegerField()
    
    def validate_variant_id(self, value):
        """Validate that variant exists."""
        try:
            ProductVariant.objects.get(id=value)
            return value
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError("Product variant not found")
