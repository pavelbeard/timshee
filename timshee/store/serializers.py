from django.db.models import Sum
from rest_framework import serializers
from . import models, strict_serializers
from order import strict_serializers as order_strict_serializers


class CategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ["name"]


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Type
        fields = "__all__"
        depth = 2


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Size
        fields = "__all__"


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Color
        fields = '__all__'


class StockSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()

    def get_item(self, obj):
        return strict_serializers.StrictItemSerializer(obj.item, many=False).data

    class Meta:
        model = models.Stock
        fields = "__all__"
        depth = 2


class CarouselImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CarouselImage
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    sizes = serializers.SerializerMethodField()
    colors = serializers.SerializerMethodField()
    carousel_images = serializers.SerializerMethodField()

    def get_sizes(self, obj):
        return SizeSerializer(obj.sizes.distinct(), many=True).data

    def get_colors(self, obj):
        return ColorSerializer(obj.colors.distinct(), many=True).data

    def get_carousel_images(self, obj):
        carousel_images = models.CarouselImage.objects.filter(item=obj.pk)
        return CarouselImageSerializer(carousel_images, many=True).data

    class Meta:
        model = models.Item
        fields = "__all__"
        depth = 2


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = "__all__"


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Collection
        fields = "__all__"


class WishlistSerializer(serializers.ModelSerializer):
    stock = strict_serializers.StrictStockSerializer()
    user = order_strict_serializers.StrictUserSerializer()

    class Meta:
        model = models.Wishlist
        fields = "__all__"
        depth = 2

    def get_fields(self, *args, **kwargs):
        fields = super().get_fields(*args, **kwargs)
        request = self.context.get('request')
        if request is not None and not request.parser_context.get('kwargs'):
            fields.pop('session')
        return fields
