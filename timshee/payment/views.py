import logging
import sys
import uuid

from django.conf import settings
from django.utils import timezone
from order import models as order_models
from stuff import models as stuff_models
from order import serializers as order_serializers
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from yookassa import Configuration, Payment, Refund
from . import serializers, models

Configuration.configure(settings.ACCOUNT_ID, settings.API_KEY)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)


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
    permission_classes = (permissions.AllowAny,)
    authentication_classes = [JWTAuthentication]
    lookup_field = 'store_order_id'

    def get_serializer_class(self):
        if self.action in ['list', 'create', 'update', 'partial_update', 'retrieve', 'get_status', 'get_only_succeeded_orders']:
            return serializers.PaymentSerializer
        elif self.action in ['refund_whole_order']:
            return serializers.PaymentRefundWholeSerializer
        elif self.action in ['refund_partial']:
            return serializers.PaymentRefundPartialSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        order = order_models.Order.objects.get(second_id=instance.store_order_id)

        if not order:
            return Response({
                "detail": "order does not exist"
            }, status=status.HTTP_404_NOT_FOUND)

        ordered_items = order.orderitem_set.all()

        items = []

        for ordered_item in ordered_items:
            items.append({
                "description": ordered_item.item.item.name + "\n" + ordered_item.item.item.description,
                "quantity": ordered_item.quantity,
                "amount": {
                    "value": str(ordered_item.item.item.price),
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
            owner_data = stuff_models.OwnerData.objects.all().first()
            redirect_url = f"/order/{order.second_id}/status/check?order_number={order.order_number}"
            idempotency_key = str(uuid.uuid4())
            payment = Payment.create(
                {
                    "amount": {
                        "value": str(order.total_price()),
                        "currency": "RUB"
                    },
                    "confirmation": {
                        "type": "redirect",
                        "return_url": settings.CLIENT_REDIRECT + redirect_url,
                    },
                    "capture": True,
                    "description": f"Order number: {order.order_number}\n"
                                   f"Timshee store",
                    "metadata": {
                        'orderNumber': order.order_number
                    },
                    "receipt": {
                        "customer": {
                            "full_name": owner_data.full_name,
                            "email": owner_data.email,
                            "phone": owner_data.contact_number,
                            "inn": owner_data.tax_number
                        },
                        "items": items
                    },
                }
                ,
                idempotency_key=idempotency_key
            )

            if payment.status == 'pending':
                instance.payment_id = payment.id
                instance.status = payment.status
                instance.created_at = payment.created_at
                instance.captured_at = payment.captured_at
                instance.save()

                confirmation_url = payment.confirmation.confirmation_url
                return Response({
                    "confirmation_url": confirmation_url,
                    "id": instance.id,
                    "success": True
                },
                    status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": payment.status, "success": False}, )
        except Exception as e:
            logger.error(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['GET'])
    def get_status(self, request, *args, **kwargs):
        try:
            order_id = self.kwargs.get('store_order_id')
            if order_id:
                payment = models.Payment.objects.filter(store_order_id=order_id).first()
                dt = payment.created_at.isoformat()
                filtered_objects = Payment.list(params={"created_at": dt, "limit": 1}).items[-1]

                return Response({"status": filtered_objects.status}, status=status.HTTP_200_OK)
            return Response({"detail": "order not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['GET'])
    def get_only_succeeded_orders(self, request, *args, **kwargs):
        try:
            qs = self.queryset.all()
            params = {"limit": 50}

            filter_objects = (list(filter(
                lambda x: x.id in [str(qs_object.payment_id) for qs_object in qs] and x.status == 'succeeded',
                [payment_obj for payment_obj in Payment.list(params=params).items]
            )))

            qs.filter(payment_id__in=[fo.id for fo in filter_objects]).update(status='succeeded')

            new_qs = qs.filter(status='succeeded')

            data = self.get_serializer(new_qs, many=True).data

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['PUT'])
    def refund_whole_order(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            reason = data.get('reason', None)
            order_id = kwargs.get('store_order_id', None)
            if order_id:
                order = order_models.Order.objects.filter(second_id=order_id).first()

                if order and order.status == 'processing' or 'completed':
                    payment_data_from_backend = models.Payment.objects.filter(store_order_id=order_id).first()
                    payment_id = str(payment_data_from_backend.payment_id)

                    refund = Refund.create({
                        "amount": {
                            "value": order.total_price(),
                            "currency": "RUB",
                        },
                        "payment_id": payment_id,
                    })

                    if refund.status == 'succeeded':
                        order.status = 'refunded'
                        order.non_refundable = True
                        order.updated_at = timezone.now()
                        order.refund_reason = reason

                        for order_item in order.orderitem_set.all():
                            quantity = order_item.quantity
                            order_item.item.increase_stock(quantity=quantity)
                            returned_item = order_models.ReturnedItem(
                                order=order,
                                item=order_item.item,
                                quantity=quantity,
                                refund_reason='refunded'
                            )
                            returned_item.save()
                            order_item.quantity = 0
                            order_item.save()

                        order.save()
                        payment_data_from_backend.status = 'refunded'
                        payment_data_from_backend.save()

                        data = order_serializers.OrderSerializer(order).data
                        return Response(data, status=status.HTTP_200_OK)
                    else:
                        return Response({"detail": "order didn't refund"}, status=status.HTTP_400_BAD_REQUEST)
                return Response({"detail": "order not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"detail": "no data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['PUT'])
    def refund_partial(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data

            stock_item_id = data.get('stock_item_id', None)
            quantity = data.get('quantity', None)
            quantity_total = data.get('quantity_total', None)
            reason = data.get('reason', None)
            order_id = kwargs.get('store_order_id', None)
            if order_id:
                order = order_models.Order.objects.get(second_id=order_id)

                if order and order.status == 'processing' or 'completed':
                    order_item = order.orderitem_set.get(item_id=stock_item_id)
                    order_item.item.increase_stock(quantity=quantity)
                    returned_item, created = order_models.ReturnedItem.objects.get_or_create(
                        order=order,
                        item=order_item.item,
                        quantity=quantity,
                    )
                    if not created:
                        returned_item.quantity += int(quantity)
                    order_item.quantity -= int(quantity)
                    payment_data_from_backend = models.Payment.objects.filter(store_order_id=order_id).first()
                    payment_id, stock_item_price = str(payment_data_from_backend.payment_id), order_item.item.item.price

                    try:
                        partial_refund = Refund.create({
                            "amount": {
                                "value": stock_item_price * quantity,
                                "currency": "RUB",
                            },
                            "payment_id": payment_id,
                        })

                        if partial_refund.status == 'succeeded':
                            order.refund_reason = reason
                            returned_item.refund_reason = 'partial_refunded'
                            payment_data_from_backend.status = 'partial_refunded'
                            order.status = 'partial_refunded'
                            order.updated_at = timezone.now()
                            returned_item.save()
                            payment_data_from_backend.save()
                            order_item.save()
                            if order.order_item.count() == 0:
                                order.refund_reason = 'refunded'
                                order.status = 'refunded'
                                order.non_refundable = True
                            order.save()
                            data = order_serializers.OrderSerializer(order).data
                            return Response(data, status=status.HTTP_200_OK)

                        return Response(
                            {"detail": "an order has been partial refunded", "status": partial_refund.status},
                            status=status.HTTP_200_OK)
                    except Exception as e:
                        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                return Response({"detail": "order not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"detail": "no data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(msg=f"{e.args}", exc_info=e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
