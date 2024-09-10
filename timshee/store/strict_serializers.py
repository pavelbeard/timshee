from rest_framework import serializers
from . import models


class StrictItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Item
        exclude = ["sizes", "colors"]
        depth = 2


class StrictStockSerializer(serializers.ModelSerializer):
    item = StrictItemSerializer()

    class Meta:
        model = models.Stock
        fields = "__all__"
        depth = 2


class StrictTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Type
        fields = '__all__'
