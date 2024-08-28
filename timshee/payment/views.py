from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from . import serializers, models, payment_logic


# {
#   'id': 119,
#   'shipping_address': {
#     'id': 2,
#     'first_name': 'AN',
#     'last_name': 'DRE',
#     'city': 'Alicante',
#     'address1': 'Avda. Benito Pérez Galdós',
#     'address2': '4',
#     'postal_code': '03004',
#     'email': 'heavycream9090@icloud.com',
#     'phone_number': '622865890',
#     'additional_data': '',
#     'province': 1,
#     'phone_code': 1
#   },
#   'order_number': '10146-AN',
#   'ordered_items': {
#     'data': [
#       {
#         'quantity': 1,
#         'price': 349.99,
#         'stock': {
#           'id': 3,
#           'item': {
#             'id': 1,
#             'name': 'Camiseta muy buena',
#             'gender': 'F',
#             'description': 'Элегантный и утончённый кашемировый пуловер – это идеальный выбор для тех, кто ценит комфорт и стиль. Изготовленный из 100% чистого кашемира, этот пуловер обладает невероятной мягкостью, которая приятна к телу, делая его идеальным для прохладной погоды. Шелковистая текстура кашемира не только комфортна, но и придает изысканный вид, подчеркивая вашу любовь к качественной одежде.\r\n\r\nПуловер имеет классический крой с круглым воротником, который легко сочетается как с более формальной одеждой, так и с повседневными нарядами. Эта универсальность делает его отличным выбором для различных случаев — от деловых встреч до дружеских собраний. Рукава и нижняя часть пуловера аккуратно оканчиваются эластичными манжетами, обеспечивающими идеальную посадку и сохраняющими тепло.\r\n\r\nМодель:\r\n\r\nРост: 177 см\r\nРазмер: М\r\nХипс: 85 см',
#             'price': '349.99',
#             'discount': '0.00',
#             'image': '/timshee/media/product_images/item_images/_23f3935c-de39-46bd-bab4-d5e2d22c0c30.jpeg',
#             'collection': {
#               'id': 3,
#               'name': 'aw2023/2024',
#               'collection_image': '/timshee/media/product_images/collection_images/Calzoncillo-Calvin_Klein-Boxer-negro-cinturilla_ancha-_o8kfTJS.jpeg',
#               'link': 'autum-winter-2023-2024'
#             },
#             'type': {
#               'id': 7,
#               'name': 'Camisetas',
#               'category': {
#                 'id': 3,
#                 'name': 'Top',
#                 'category_image': '/timshee/media/product_images/category_images/Calzoncillo-Calvin_Klein-Boxer-negro-cinturilla_ancha-MI_5HobKs6.jpeg'
#               }
#             }
#           },
#           'in_stock': 39,
#           'size': {
#             'id': 1,
#             'value': 'XS'
#           },
#           'color': {
#             'id': 9,
#             'name': 'MEDIUM PURPLE',
#             'hex': '#A661ED'
#           }
#         },
#         'total_price': '349.99'
#       }
#     ],
#     'total_price': 349.99
#   },
#   'status': 'pending_for_pay',
#   'created_at': '2024-05-22T20:12:28.887534+03:00',
#   'updated_at': '2024-05-22T20:13:03.712486+03:00',
#   'shipping_method': {
#     'id': 2,
#     'shipping_name': 'DHL',
#     'price': '30.00'
#   }
# }
# Create your views here.
class PaymentViewSet(viewsets.ModelViewSet):
    queryset = models.Payment.objects.all()
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]
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

    @action(detail=True, methods=['PUT'])
    def update_payment(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.data)
        ok, status_ = payment_logic.update_payment(request, serializer.data, **kwargs)

        if not ok:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status_, status=status.HTTP_200_OK)

    @action(detail=True, methods=['GET'])
    def get_status(self, request, *args, **kwargs):
        result, data = payment_logic.get_status(**kwargs)

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
