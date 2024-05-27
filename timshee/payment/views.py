import uuid
from decimal import Decimal

from django.conf import settings
from django.utils import timezone
from order import models as order_models
from order import serializers as order_serializers
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from yookassa import Configuration, Payment

Configuration.configure(settings.ACCOUNT_ID, settings.API_KEY)

from . import serializers, models


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
    serializer_class = serializers.PaymentSerializer
    permission_classes = (permissions.AllowAny,)

    @action(detail=False, methods=['GET'])
    def get_status(self, request, *args, **kwargs):
        order_number = request.query_params.get('order_number', None)
        if order_number:
            payment = models.Payment.objects.filter(store_order_number=order_number).first()
            dt = payment.created_at.isoformat()
            filtered_objects = Payment.list(params={"created_at": dt, "limit": 1}).items[-1]

            return Response({"status": filtered_objects.status}, status=status.HTTP_200_OK)
        return Response({"detail": "order not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['GET'])
    def get_only_succeeded_orders(self, request, *args, **kwargs):
        qs = self.queryset.all()
        params = {
            "limit": 50,
        }

        filter_objects = (list(filter(
            lambda x: x.id in [str(qs_object.payment_id) for qs_object in qs] and x.status == 'succeeded',
            [payment_obj for payment_obj in Payment.list(params=params).items]
        )))

        qs.filter(payment_id__in=[fo.id for fo in filter_objects]).update(status='succeeded')

        new_qs = qs.filter(status='succeeded')

        data = self.get_serializer(new_qs, many=True).data

        return Response(data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        order_id = data.get('order_id')

        order = None
        if order_id and request.user.is_authenticated:
            order = order_models.Order.objects.filter(id=order_id)
        elif order_id and request.user.is_anonymous:
            order = order_models.AnonymousOrder.objects.filter(id=order_id)

        if not order:
            return Response({
                "detail": "order does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        if request.user.is_authenticated:
            serialized_data = order_serializers.OrderSerializer(order.first()).data
        else:
            serialized_data = order_serializers.AnonymousOrderSerializer(order.first()).data

        total_price = (Decimal(serialized_data.get('ordered_items').get('total_price'))
                       + Decimal(serialized_data.get('shipping_method').get('price')))

        order_number = serialized_data.get('order_number')
        ordered_items = serialized_data.get('ordered_items')['data']

        items = []

        for item in ordered_items:
            items.append({
                "description": item["stock"]["item"]["name"],
                "quantity": item["quantity"],
                "amount": {
                    "value": str(Decimal(item["stock"]["item"]["price"])),
                    "currency": "RUB"
                },
                # NEEDS INN RUSSIAN
                "vat_code": "2",
                "payment_mode": "full_payment",
                "payment_subject": "commodity",
                "country_of_origin_code": "RU",
            })

        # items = [
        #     {
        #         "description": "Переносное зарядное устройство Хувей",
        #         "quantity": "1.00",
        #         "amount": {
        #             "value": 1000,
        #             "currency": "RUB"
        #         },
        #         "vat_code": "2",
        #         "payment_mode": "full_prepayment",
        #         "payment_subject": "commodity",
        #         "country_of_origin_code": "CN",
        #         "product_code": "44 4D 01 00 21 FA 41 00 23 05 41 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 12 00 AB 00",
        #         "customs_declaration_number": "10714040/140917/0090376",
        #         "excise": "20.00",
        #         "supplier": {
        #             "name": "string",
        #             "phone": "string",
        #             "inn": "string"
        #         }
        #     },
        # ]

        try:
            redirect_url = f"shop/{order_id}/checkout/order-check/{order_number}"
            idempotency_key = str(uuid.uuid4())
            payment = Payment.create(
                {
                    "amount": {
                        "value": str(total_price),
                        "currency": "RUB"
                    },
                    "confirmation": {
                        "type": "redirect",
                        "return_url": settings.CLIENT_REDIRECT + redirect_url,
                    },
                    "capture": True,
                    "description": f"Order number: {order_number}\n"
                                   f"Timshee store",
                    "metadata": {
                        'orderNumber': order_number
                    },
                    "receipt": {
                        "customer": {
                            "full_name": "Ivanov Ivan Ivanovich",
                            "email": "email@email.ru",
                            "phone": "79211234567",
                            "inn": "6321341814"
                        },
                        "items": items
                    },
                }
                , idempotency_key=idempotency_key
            )

            if payment.status == 'pending':
                qs = models.Payment.objects.filter(store_order_number=order_number)
                if qs.exists():
                    qs.update(
                        payment_id=payment.id,
                        created_at=payment.created_at,
                        captured_at=payment.captured_at,
                        status=payment.status,
                    )
                else:
                    payment_object = models.Payment(
                        payment_id=payment.id,
                        status=payment.status,
                        store_order_id=order_id,
                        store_order_number=order_number,
                        created_at=payment.created_at,
                        captured_at=payment.captured_at,
                    )
                    payment_object.save()

                confirmation_url = payment.confirmation.confirmation_url
                return Response({"confirmation_url": confirmation_url, "success": True},
                                status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": payment.status, "success": False}, )
        except Exception as e:
            return Response({"detail": f"something went wrong: {e}", "success": False},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
