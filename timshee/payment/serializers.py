from rest_framework import serializers

from . import models


class PaymentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    payment_id = serializers.UUIDField(required=False)

    class Meta:
        model = models.Payment
        fields = '__all__'
