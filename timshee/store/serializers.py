from rest_framework import serializers
from .models import Item, Category, Collection, SizeColor, Type, Logo, RoundImage, Color, ItemSizeColor, Size


class CategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]


class TypeSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()

    def get_category(self, obj):
        qs = Category.objects.filter(name=obj.category.name).first()
        serializer = CategoryNameSerializer(qs, many=False)
        return serializer.data

    class Meta:
        model = Type
        fields = "__all__"


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = "__all__"


class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'


class ItemAuxSerializer(serializers.ModelSerializer):
    type = TypeSerializer()

    class Meta:
        model = Item
        fields = ["id", "name", "gender", "description", "type", "price", "discount", "image"]


class ItemSizeColorSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()

    def get_item(self, obj):
        qs = Item.objects.filter(pk=obj.id).first()
        serializer = ItemAuxSerializer(qs, many=False)
        return serializer.data

    def get_size(self, obj):
        qs = Size.objects.filter(name=obj.size_color.size).first()
        serializer = SizeSerializer(qs, many=False)
        return serializer.data

    def get_color(self, obj):
        print(obj.size_color)
        qs = Color.objects.filter(id=obj.size_color.color.id).first()
        serializer = ColorSerializer(qs, many=False)
        return serializer.data

    class Meta:
        model = ItemSizeColor
        fields = ["item", "size", "color", "quantity"]


class RoundImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoundImage
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    round_images = serializers.SerializerMethodField()
    sizes_colors = serializers.SerializerMethodField(label="color_sizes")
    type = serializers.SerializerMethodField()
    collection = serializers.SerializerMethodField()

    def get_round_images(self, obj):
        qs = RoundImage.objects.filter(item=obj)
        serializer = RoundImageSerializer(qs, many=True)
        return serializer.data

    def get_sizes_colors(self, obj):
        qs = ItemSizeColor.objects.filter(item=obj)
        serializer = ItemSizeColorSerializer(qs, many=True)
        return serializer.data

    def get_type(self, obj):
        qs = Type.objects.filter(item=obj).first()
        serializer = TypeSerializer(qs, many=False)
        return serializer.data

    def get_collection(self, obj):
        qs = Collection.objects.filter(item=obj).first()
        serializer = CollectionSerializer(qs, many=False)
        return serializer.data

    class Meta:
        model = Item
        fields = "__all__"


class LogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logo
        fields = "__all__"


class SizeColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SizeColor
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    types = serializers.SerializerMethodField()

    def get_types(self, obj):
        qs = Type.objects.filter(category=obj)
        serializer = TypeSerializer(qs, many=True)
        return serializer.data

    class Meta:
        model = Category
        fields = "__all__"


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = "__all__"
