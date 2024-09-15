from rest_framework import serializers

from auxiliaries.auxiliaries_methods import get_image
from . import models


class StrictItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, obj):
        return get_image(self.context, obj)

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
