from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Cart, CartItem
# from store.models import ItemSizeColor
# from store.serializers import ItemSizeColorSerializer


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email"]


class CartItemSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()
    # def create(self, validated_data):
    #     item = validated_data.get("item")
    #     cart = validated_data.get("cart")
    #
    #     cart_item_exist = CartItem.objects.filter(item=item, cart=cart).first()
    #
    #     if cart_item_exist:
    #         raise serializers.ValidationError("Item already has added in cart")
    #
    #     quantity = validated_data.get("quantity", 1)
    #
    #     if item.quantity < quantity:
    #         raise serializers.ValidationError("Not enough items in stock")
    #
    #     return super().create(validated_data)
    #
    # def update(self, instance, validated_data):
    #     if "quantity" in validated_data:
    #         quantity = validated_data.get("quantity")
    #
    #         if instance.item.quantity < quantity:
    #             raise serializers.ValidationError("Not enough items in stock")
    #
    #         instance.quantity = quantity
    #         instance.save()
    #
    #     return instance

    # def get_items(self, obj):
    #     qs = ItemSizeColor.objects.filter(cartitem=obj)
    #     serializer = ItemSizeColorSerializer(qs, many=True)
    #     return serializer.data

    class Meta:
        model = CartItem
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    items = CartItemSerializer(many=True, read_only=True)

    def get_user(self, obj):
        user = User.objects.get(pk=obj.user.id)
        serializer = UserSerializer(user, many=False)
        return serializer.data

    class Meta:
        model = Cart
        fields = ["user", "items"]
