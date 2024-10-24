from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from . import serializers, models, payment_logic

# Create your views here.
class PaymentViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    queryset = models.Payment.objects.all()
    lookup_field = 'store_order_id'

    def get_serializer_class(self):
        if self.action in [
            'list',
            'create',
            'update',
            'partial_update',
            'retrieve',
            'get_status',
            'get_only_succeeded_orders'
        ]:
            return serializers.PaymentSerializer
        elif self.action in ['create_payment']:
            return serializers.PaymentCreateSerializer
        elif self.action in ['update_payment']:
            return serializers.PaymentUpdateSerializer
        elif self.action in ['refund_whole_order']:
            return serializers.PaymentRefundWholeSerializer
        elif self.action in ['refund_partial']:
            return serializers.PaymentRefundPartialSerializer

    @action(detail=False, methods=['POST'])
    def create_payment(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.data)
        result, data, confirmation_url = payment_logic.create_payment(request, serializer.data)

        if result == 1:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        elif result == 2:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif result == 3:
            Response(data, status=status.HTTP_404_NOT_FOUND)

        data = {
            "confirmation_url": confirmation_url,
            "id": data.id,
            "success": True
        }
        return Response(data, status=status.HTTP_201_CREATED)


    @action(detail=True, methods=['GET'])
    def get_status(self, request, *args, **kwargs):
        result, data = payment_logic.get_flow_status(request, **kwargs)

        if result == 1:
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        elif result == 2:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['GET'])
    def get_only_succeeded_orders(self, request, *args, **kwargs):
        qs = self.queryset.all()
        ok, data = payment_logic.get_only_succeeded_orders(qs, serializer=self.get_serializer)

        if not ok:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        Response(data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['PUT'])
    def refund_whole_order(self, request, *args, **kwargs):
        result, data = payment_logic.refund_whole_order(
            rq=request,
            data=request.data,
            serializer=self.get_serializer,
            **kwargs
        )

        # order didn't refund
        if result == 1:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        # order not found
        elif result == 2:
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        # order is without data
        elif result == 3:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        # server error
        elif result == 4:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['PUT'])
    def refund_partial(self, request, *args, **kwargs):
        result, data = payment_logic.refund_partial(
            rq=request,
            data=request.data,
            serializer=self.get_serializer,
            **kwargs
        )

        # order not found
        if result == 1:
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        # payment didn't refund
        elif result == 2:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        # server error
        elif result == 3:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data, status=status.HTTP_200_OK)
