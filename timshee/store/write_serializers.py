from rest_framework import serializers

from . import models


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Item
        fields = '__all__'


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Stock
        fields = '__all__'
