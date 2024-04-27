from django.contrib.auth import get_user_model
from rest_framework import serializers

from order import strict_serializers as order_strict_serializers
from . import models, strict_serializers


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email"]


class CartItemSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()
    cart = serializers.SerializerMethodField()

    def get_stock(self, obj):
        return order_strict_serializers.StrictStockSerializer(obj.stock).data

    def get_cart(self, obj):
        return strict_serializers.StrictCartSerializer(obj.cart).data

    class Meta:
        model = models.CartItem
        fields = "__all__"
        depth = 2


class CartSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return UserSerializer(obj.user).data

    class Meta:
        model = models.Cart
        fields = ["id", "user"]


class AnonymousCartItemSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()
    anon_cart = serializers.ReadOnlyField(source="anon_cart.id")

    def get_stock(self, obj):
        return order_strict_serializers.StrictStockSerializer(obj.stock).data

    class Meta:
        model = models.AnonymousCartItem
        fields = "__all__"


class AnonymousCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousCart
        fields = "__all__"
