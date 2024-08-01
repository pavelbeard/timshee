from rest_framework import serializers

from . import models


class PaymentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    payment_id = serializers.UUIDField(required=False)
    store_order_number = serializers.CharField(required=False)

    class Meta:
        model = models.Payment
        fields = '__all__'


class PaymentRefundPartialSerializer(serializers.ModelSerializer):
    stock_item_id = serializers.IntegerField()
    quantity = serializers.IntegerField()
    quantity_total = serializers.IntegerField()
    reason = serializers.CharField()

    class Meta:
        model = models.Payment
        fields = ('stock_item_id', 'quantity', 'quantity_total', 'reason')


class PaymentRefundWholeSerializer(serializers.ModelSerializer):
    stock_item_id = serializers.IntegerField()
    reason = serializers.CharField()

    class Meta:
        model = models.Payment
        fields = ('stock_item_id', 'reason')


class PaymentGetStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Payment
        fields = ('store_order_id',)

