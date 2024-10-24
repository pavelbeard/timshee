from django.contrib.auth import get_user_model
from rest_framework import serializers

from store import serializers as store_serializers
from . import models

User = get_user_model()

class CartAddSerializer(serializers.Serializer):
    item_id = serializers.IntegerField()
    size_id = serializers.IntegerField()
    color_id = serializers.IntegerField()
    quantity = serializers.IntegerField()


class CartRemoveSerializer(serializers.Serializer):
    stock_id = serializers.IntegerField()


class CartUpdateSerializer(serializers.Serializer):
    stock_id = serializers.IntegerField()
    quantity = serializers.IntegerField()
    increase = serializers.BooleanField()


class CartResponseSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    cart_items = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    total_items = serializers.SerializerMethodField()

    def get_user(self, obj):
        user_obj = obj.user
        if hasattr(user_obj, 'id'):
            return {
                'id': user_obj.id,
                'username': user_obj.username,
                'email': user_obj.email,
            }

        return None

    def get_cart_items(self, obj):
        rq = self.context.get('request')
        if not rq:
            return []
        cart_items = obj.cart_items.all()
        data = []
        for cart_item in cart_items:
            data.append({
                'id': cart_item.id,
                'quantity': cart_item.quantity,
                'stock_item': store_serializers.StockSerializer(cart_item.stock_item, context={'request': rq}).data,
            })

        return data

    def get_total(self, obj):
        return obj.get_total_price()

    def get_total_items(self, obj):
        return obj.get_total_items()

    class Meta:
        model = models.Cart
        exclude = ('session', )
        depth = 2


