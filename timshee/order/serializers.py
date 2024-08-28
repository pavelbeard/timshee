from django.contrib.auth import get_user_model
from rest_framework import serializers

from . import models, strict_serializers
from .models import Continent

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', "last_name", 'email']


class ContinentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Continent
        fields = '__all__'


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Country
        fields = "__all__"
        depth = 2


class CountryPhoneCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CountryPhoneCode
        fields = "__all__"
        depth = 3


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Province
        fields = "__all__"
        depth = 2


class AddressSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return strict_serializers.StrictUserSerializer(obj.user).data

    class Meta:
        model = models.Address
        fields = "__all__"
        depth = 2

    def get_fields(self, *args, **kwargs):
        fields = super().get_fields(*args, **kwargs)
        request = self.context.get('request')
        if request is not None and not request.parser_context.get('kwargs'):
            fields.pop('session')
        return fields


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItem
        exclude = ("order",)
        depth = 2


class ReturnedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ReturnedItem
        exclude = ("order",)
        depth = 2


class OrderSerializer(serializers.ModelSerializer):
    shipping_address = serializers.SerializerMethodField()
    shipping_method = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField(required=False)
    order_number = serializers.CharField(required=False)
    order_item = serializers.SerializerMethodField()
    returned_item = serializers.SerializerMethodField()
    items_total_price = serializers.SerializerMethodField()
    shipping_price = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    def get_order_item(self, obj):
        data = models.OrderItem.objects.filter(order_id=obj.id)
        return OrderItemSerializer(data, many=True).data

    def get_returned_item(self, obj):
        data = models.ReturnedItem.objects.filter(order_id=obj.id)
        return ReturnedItemSerializer(data, many=True).data

    def get_items_total_price(self, obj):
        return obj.items_total_price()

    def get_shipping_price(self, obj):
        return obj.shipping_price()

    def get_total_price(self, obj):
        return obj.total_price()

    def get_shipping_address(self, obj):
        return None if obj.shipping_address is None else strict_serializers.StrictAddressSerializer(
            obj.shipping_address).data

    def get_shipping_method(self, obj):
        return None if obj.shipping_method is None else ShippingMethodSerializer(obj.shipping_method).data

    def get_user(self, obj):
        return None if obj.user is None else UserSerializer(obj.user).data

    class Meta:
        model = models.Order
        fields = "__all__"
        depth = 3

    def get_fields(self, *args, **kwargs):
        fields = super().get_fields(*args, **kwargs)
        request = self.context.get('request')
        if request is not None and not request.parser_context.get('kwargs'):
            fields.pop('session')
        return fields


class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ShippingMethod
        fields = "__all__"
