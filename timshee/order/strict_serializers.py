from django.contrib.auth import get_user_model
from rest_framework import serializers
from store import models as store_models

from . import models

User = get_user_model()


class StrictUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email')


class StrictItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = store_models.Item
        # exclude = ["sizes", "colors", "collection"]
        fields = "__all__"
        depth = 2


class StrictStockSerializer(serializers.ModelSerializer):
    item = serializers.SerializerMethodField()

    def get_item(self, obj):
        return StrictItemSerializer(obj.item).data

    class Meta:
        model = store_models.Stock
        exclude = ["in_stock"]
        depth = 2


class StrictAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Address
        exclude = ['user']




class StrictAnonymousAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousAddress
        exclude = ['session']

