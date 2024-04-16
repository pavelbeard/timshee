from rest_framework import serializers
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        item = validated_data.get("item")
        cart = validated_data.get("cart")

        cart_item_exist = CartItem.objects.filter(item=item, cart=cart).first()

        if cart_item_exist:
            raise serializers.ValidationError("Item already has added in cart")

        quantity = validated_data.get("quantity", 1)

        if item.quantity < quantity:
            raise serializers.ValidationError("Not enough items in stock")

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if "quantity" in validated_data:
            quantity = validated_data.get("quantity")

            if instance.item.quantity < quantity:
                raise serializers.ValidationError("Not enough items in stock")

            instance.quantity = quantity
            instance.save()

        return instance

    class Meta:
        model = CartItem
        fields = ["id", "item", "quantity", "cart"]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["user", "items"]
