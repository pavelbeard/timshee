from rest_framework import serializers
from .models import Item, Category, Collection, Size, Type, Logo, RoundImage


class RoundImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoundImage
        fields = "__all__"


class ItemSerializer(serializers.ModelSerializer):
    round_images = serializers.SerializerMethodField()
    sizes = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    collection = serializers.SerializerMethodField()

    def get_round_images(self, obj):
        qs = RoundImage.objects.filter(item=obj)
        serializer = RoundImageSerializer(qs, many=True)
        return serializer.data

    def get_sizes(self, obj):
        qs = Size.objects.filter(items=obj)
        serializer = SizeSerializer(qs, many=True)
        return serializer.data

    def get_type(self, obj):
        qs = Type.objects.filter(item=obj).first()
        serializer = TypeSerializer(qs, many=False)
        return serializer.data

    def get_category(self, obj):
        qs = Category.objects.filter(item=obj).first()
        serializer = CategorySerializer(qs, many=False)
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


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = "__all__"


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = "__all__"
