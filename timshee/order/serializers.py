from django.contrib.auth import get_user_model
from rest_framework import serializers

from . import models, strict_serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', "last_name", 'email']


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


class OrderSerializer(serializers.ModelSerializer):
    shipping_address = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    def get_shipping_address(self, obj):
        return strict_serializers.StrictAddressSerializer(obj.shipping_address).data

    def get_user(self, obj):
        return UserSerializer(obj.user).data

    class Meta:
        model = models.Order
        fields = "__all__"
        depth = 3


class AnonymousAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousAddress
        exclude = ["session"]
        depth = 2


class AnonymousOrderSerializer(serializers.ModelSerializer):
    shipping_address = serializers.SerializerMethodField()

    def get_shipping_address(self, obj):
        return strict_serializers.StrictAnonymousAddressSerializer(obj.shipping_address).data

    class Meta:
        model = models.AnonymousOrder
        exclude = ["session"]
        depth = 2


class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ShippingMethod
        fields = "__all__"
