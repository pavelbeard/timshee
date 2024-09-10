from rest_framework import serializers

from . import models


class PaymentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    payment_id = serializers.UUIDField(required=False)
    store_order_number = serializers.CharField(required=False)

    class Meta:
        model = models.Payment
        fields = '__all__'

class PaymentCreateSerializer(serializers.Serializer):
    order_id = serializers.CharField()
    order_status = serializers.CharField()


class PaymentUpdateSerializer(serializers.Serializer):
    payment_status = serializers.CharField()


class PaymentRefundPartialSerializer(serializers.ModelSerializer):
    stock_item_id = serializers.IntegerField()
    quantity = serializers.IntegerField()
    quantity_total = serializers.IntegerField()
    reason = serializers.CharField()

    class Meta:
        model = models.Payment
        fields = ('stock_item_id', 'quantity', 'quantity_total', 'reason')


class PaymentRefundWholeSerializer(serializers.ModelSerializer):
    reason = serializers.CharField()

    class Meta:
        model = models.Payment
        fields = ('reason', )


class PaymentGetStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Payment
        fields = ('store_order_id',)

