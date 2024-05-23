import os
import uuid
from decimal import Decimal

from django.conf import settings
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from yookassa import Configuration, Payment

from order import models as order_models
from store import models as store_models
from cart import service
from order import serializers as order_serializers

print(settings.ACCOUNT_ID, settings.API_KEY)

Configuration.configure(settings.ACCOUNT_ID, settings.API_KEY)


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
class PaymentAPIView(APIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ('GET', 'POST', 'PUT', 'DELETE')

    def post(self, request):
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
            res = Payment.create(
                {
                    "amount": {
                        "value": str(total_price),
                        "currency": "RUB"
                    },
                    "confirmation": {
                        "type": "redirect",
                        "return_url": settings.CLIENT_REDIRECT + f"shop/{order_number}/checkout/order-paid",
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
                    }
                }
            )

            return Response({"redirect_url": res.confirmation.confirmation_url},
                            status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"detail": "something went wrong", "exception": f"{e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
