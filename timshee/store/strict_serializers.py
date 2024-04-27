from rest_framework import serializers
from . import models


class StrictItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Item
        exclude = ["sizes", "colors"]
        depth = 2
