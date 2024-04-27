from django.contrib.auth import get_user_model
from rest_framework import serializers

from . import models

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', "last_name", 'email']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.City
        fields = "__all__"


class AddressSerializer(serializers.ModelSerializer):
    user = UserSerializer(required=False)

    class Meta:
        model = models.Address
        fields = "__all__"


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = "__all__"


class AnonymousAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousAddress
        fields = "__all__"


class AnonymousOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousOrder
        fields = "__all__"
