from rest_framework import serializers


class SizeSerializer(serializers.Serializer):
    stock__size__value = serializers.CharField()
    total_sizes = serializers.IntegerField()


class ColorSerializer(serializers.Serializer):
    stock__color__name = serializers.CharField()
    total_colors = serializers.IntegerField()


class TypeSerializer(serializers.Serializer):
    type__name = serializers.CharField()
    total_types = serializers.IntegerField()
