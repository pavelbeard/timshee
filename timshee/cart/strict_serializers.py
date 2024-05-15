from django.contrib.auth import get_user_model
from rest_framework import serializers

from . import models

User = get_user_model()


class StrictUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', "last_name", 'email']


class StrictCartSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        return StrictUserSerializer(obj.user).data

    class Meta:
        model = models.Cart
        fields = '__all__'


class StrictAnonymousCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousCart
        exclude = ['session']


class StrictAnonymousCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AnonymousCartItem
        fields = '__all__'
        # exclude = ['session']
