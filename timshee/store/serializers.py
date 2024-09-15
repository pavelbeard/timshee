from rest_framework import serializers

from auxiliaries.auxiliaries_methods import get_image
from . import models, strict_serializers
from order import strict_serializers as order_strict_serializers


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
        rq = self.context.get('request')
        if not rq:
            return None
        return strict_serializers.StrictItemSerializer(obj.item, many=False, context={'request': rq}).data

    class Meta:
        model = models.Stock
        fields = "__all__"
        depth = 2


class CarouselImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CarouselImage
        fields = "__all__"


class CollectionCarouselImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = models.CollectionCarouselImage
        fields = ('image',)

    def get_image(self, obj):
        return get_image(self.context, obj)


class CategorySerializer(serializers.ModelSerializer):
    types = serializers.SerializerMethodField()

    def get_types(self, obj):
        return strict_serializers.StrictTypeSerializer(obj.types.distinct(), many=True).data

    class Meta:
        model = models.Category
        fields = "__all__"
        depth = 2


class ItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    sizes = serializers.SerializerMethodField()
    colors = serializers.SerializerMethodField()
    carousel_images = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()

    def get_image(self, obj):
        return get_image(self.context, obj)

    def get_sizes(self, obj):
        return SizeSerializer(obj.sizes.distinct(), many=True).data

    def get_colors(self, obj):
        return ColorSerializer(obj.colors.distinct(), many=True).data

    def get_carousel_images(self, obj):
        rq = self.context.get('request')
        if not rq:
            return []
        carousel_images = models.CarouselImage.objects.filter(item=obj.pk)
        return CarouselImageSerializer(carousel_images, many=True, context={'request': rq}).data

    def get_type(self, obj):
        return strict_serializers.StrictTypeSerializer(obj.type).data

    def get_discount(self, obj):
        return obj.calculate_discount()

    class Meta:
        model = models.Item
        fields = "__all__"
        depth = 2


class CollectionSerializer(serializers.ModelSerializer):
    carousel_images = serializers.SerializerMethodField()

    def get_carousel_images(self, obj):
        rq = self.context.get('request')
        if not rq:
            return []
        carousel_images = models.CollectionCarouselImage.objects.filter(collection=obj.pk)
        return CollectionCarouselImageSerializer(carousel_images, many=True, context={'request': rq}).data

    class Meta:
        model = models.Collection
        fields = "__all__"


class WishlistSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_stock(self, obj: models.Wishlist):
        rq = self.context.get('request')
        stock = models.Stock.objects.filter(id=obj.stock_id)
        if not rq:
            return None
        return strict_serializers.StrictStockSerializer(stock.first(), context={'request': rq}, many=False).data

    def get_user(self, obj):
        if obj.user:
            return order_strict_serializers.StrictUserSerializer(obj.user, many=False).data
        return None

    class Meta:
        model = models.Wishlist
        exclude = ('session',)
        depth = 2

    def get_fields(self, *args, **kwargs):
        fields = super().get_fields(*args, **kwargs)
        request = self.context.get('request')
        if request is not None and not request.parser_context.get('kwargs'):
            if hasattr(fields, 'session'):
                fields.pop('session')
        return fields
