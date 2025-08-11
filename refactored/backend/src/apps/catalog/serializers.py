"""
Catalog serializers.
"""

from rest_framework import serializers

from .models import (
    Size, Color, Collection, Category, ProductType, 
    Product, ProductImage, ProductVariant, Wishlist, CurrencyRate
)


class SizeSerializer(serializers.ModelSerializer):
    """Size serializer."""
    
    class Meta:
        model = Size
        fields = ['id', 'value', 'sort_order']


class ColorSerializer(serializers.ModelSerializer):
    """Color serializer."""
    
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex', 'is_active']


class CollectionSerializer(serializers.ModelSerializer):
    """Collection serializer."""
    
    class Meta:
        model = Collection
        fields = [
            'id', 'name', 'description', 'link', 'is_active',
            'show_in_welcome_page', 'main_image', 'men_image',
            'women_image', 'unisex_image', 'created_at'
        ]


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer."""
    
    class Meta:
        model = Category
        fields = [
            'id', 'name', 'code', 'description', 'is_active',
            'apply_gender', 'main_image', 'women_image',
            'men_image', 'unisex_image', 'created_at'
        ]


class ProductTypeSerializer(serializers.ModelSerializer):
    """Product type serializer."""
    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = ProductType
        fields = ['id', 'name', 'code', 'category', 'is_active']


class ProductImageSerializer(serializers.ModelSerializer):
    """Product image serializer."""
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'sort_order']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Product variant serializer."""
    size = SizeSerializer(read_only=True)
    color = ColorSerializer(read_only=True)
    
    class Meta:
        model = ProductVariant
        fields = [
            'id', 'size', 'color', 'sku', 'stock_quantity',
            'is_active', 'is_in_stock'
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Product list serializer (for catalog views)."""
    collection = CollectionSerializer(read_only=True)
    product_type = ProductTypeSerializer(read_only=True)
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'gender', 'collection',
            'product_type', 'base_price', 'discount_percentage',
            'discounted_price', 'main_image', 'is_active',
            'is_featured', 'is_on_sale', 'created_at'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Product detail serializer (for single product view)."""
    collection = CollectionSerializer(read_only=True)
    product_type = ProductTypeSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    discounted_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    available_sizes = SizeSerializer(many=True, read_only=True)
    available_colors = ColorSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'additional_info',
            'gender', 'collection', 'product_type', 'base_price',
            'discount_percentage', 'discounted_price', 'main_image',
            'is_active', 'is_featured', 'is_on_sale', 'images',
            'variants', 'available_sizes', 'available_colors', 'created_at'
        ]
    
    def get_available_sizes(self, obj):
        """Get available sizes for this product."""
        sizes = Size.objects.filter(
            productvariant__product=obj,
            productvariant__is_active=True
        ).distinct()
        return SizeSerializer(sizes, many=True).data
    
    def get_available_colors(self, obj):
        """Get available colors for this product."""
        colors = Color.objects.filter(
            productvariant__product=obj,
            productvariant__is_active=True
        ).distinct()
        return ColorSerializer(colors, many=True).data


class WishlistSerializer(serializers.ModelSerializer):
    """Wishlist serializer."""
    variant = ProductVariantSerializer(read_only=True)
    
    class Meta:
        model = Wishlist
        fields = ['id', 'variant', 'created_at']


class AddToWishlistSerializer(serializers.Serializer):
    """Serializer for adding items to wishlist."""
    variant_id = serializers.IntegerField()
    
    def validate_variant_id(self, value):
        """Validate that variant exists and is active."""
        try:
            ProductVariant.objects.get(id=value, is_active=True)
            return value
        except ProductVariant.DoesNotExist:
            raise serializers.ValidationError("Product variant not found")


class CurrencyRateSerializer(serializers.ModelSerializer):
    """Currency rate serializer."""
    
    class Meta:
        model = CurrencyRate
        fields = ['euro_rate', 'usd_rate', 'last_updated']
