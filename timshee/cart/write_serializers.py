from rest_framework import serializers

from . import models


class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CartItem
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Cart
        fields = '__all__'


class AnonymousCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousCartItem
        fields = '__all__'


class AnonymousCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousCart
        fields = '__all__'
