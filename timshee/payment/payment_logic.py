import re
import string
import uuid
from decimal import Decimal

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.db import Error
from django.db.models import Q, QuerySet
from django.utils import timezone
from yookassa import Payment, Configuration, Refund

from auxiliaries.auxiliaries_methods import get_logger
from cart import models as cart_models
from order import models as order_models
from order import serializers as order_serializers
from order.models import OrderItem
from . import models

Configuration.configure(settings.ACCOUNT_ID, settings.API_KEY)

logger = get_logger(__name__)

def _update_cart_status(cart):
    cart.ordered = True
    cart.save()

def _update_order_status(order, status):
    order.status = status
    order.save()

def create_payment(rq, instance):
    order: order_models.Order = order_models.Order.objects.filter(second_id=instance['order_id']).first()
    customer_email = rq.user.email if rq.user.is_authenticated else f"{order.shipping_address.email}"

    if not order:
        return 3, {"detail": "order does not exist"}

    ordered_items: QuerySet[OrderItem] = order.orderitem_set.all()

    items = []

    for ordered_item in ordered_items:
        items.append({
            "description": f'{ordered_item.item.item.name} {ordered_item.item.size.value} {ordered_item.item.color.name}',
            "quantity": ordered_item.quantity,
            "amount": {
                "value": float(ordered_item.item.item.price),
                "currency": "RUB"
            },
            # NEEDS INN RUSSIAN
            "vat_code": "4",
            "payment_mode": "full_payment",
            "payment_subject": "commodity",
            "country_of_origin_code": "RU",
        })

    items += [
        {
            "description": f'Shipping for {customer_email}',
            "quantity": 1,
            "amount": {
                "value": float(order.shipping_method.price),
                "currency": "RUB"
            },
            "vat_code": "4",
            "payment_mode": "full_payment",
            "payment_subject": "service",
            "country_of_origin_code": "RU",
        }
    ]

    try:
        amount_value = str(order.total_price())

        customer_full_name = f"{order.shipping_address.first_name} {order.shipping_address.last_name}"
        chars = re.escape(string.punctuation)
        phone_number = f"{order.shipping_address.phone_code.phone_code}{order.shipping_address.phone_number}"
        refined_phone_number = re.sub(f'[{chars}]', '', phone_number).replace(' ', '')
        redirect_url = f"orders/{order.second_id}/status/check?order_number={order.order_number}"
        idempotency_key = str(uuid.uuid4())
        params = {
            "amount": {
                "value": amount_value,
                "currency": "RUB"
            },
            "confirmation": {
                "type": "redirect",
                "return_url": settings.CLIENT_REDIRECT + redirect_url,
            },
            "capture": True,
            "description": f"Order number: {order.order_number} | Timshee store. For {customer_email}",
            "metadata": {
                'orderNumber': order.order_number
            },
            "receipt": {
                "customer": {
                    "full_name": customer_full_name,
                    "email": customer_email,
                    "phone": refined_phone_number,
                },
                "items": items
            },
        }
        print(params)
        payment = Payment.create(
            params=params,
            idempotency_key=idempotency_key
        )

        if payment.status == 'pending':
            payment_instance = models.Payment.objects.filter(store_order_id=order.second_id).first()
            if not payment_instance:
                payment_instance = models.Payment.objects.create(
                    payment_id=payment.id,
                    store_order_id=order.second_id,
                    store_order_number=order.order_number,
                    status=payment.status,
                    created_at=payment.created_at,
                    captured_at=payment.captured_at
                )

            confirmation_url = payment.confirmation.confirmation_url
            return 0, payment_instance, confirmation_url
        else:
            return 1, {"detail": payment.status, "success": False}, None
    except (Error, Exception) as e:
        logger.error(msg=f"{e.args}", exc_info=e)
        return 2, None, None

def update_payment(rq, serializer_data, **kwargs):
    if store_order_id := kwargs.get('store_order_id'):
        payment = models.Payment.objects.get(store_order_id=store_order_id)
        payment.status = serializer_data['payment_status']
        payment.save()

        user_q = None if isinstance(rq.user, AnonymousUser) else rq.user

        order: order_models.Order = order_models.Order.objects.filter(second_id=store_order_id).first()
        cart = cart_models.Cart.objects.filter(
            Q(user=user_q) | Q(session__session_key=rq.COOKIES.get('sessionid'))
        ).first()
        if payment.status == models.SUCCEEDED:
            _update_order_status(order, 'processing')
            _update_cart_status(cart)

            return True, {'status': models.SUCCEEDED}

        return True, {'status': models.PENDING}
    return False, None

def get_status(**kwargs):
    try:
        order_id = kwargs.get('store_order_id')
        if order_id:
            payment = models.Payment.objects.filter(store_order_id=order_id).first()
            dt = payment.created_at.isoformat()
            filtered_objects = Payment.list(params={"created_at": dt, "limit": 1}).items[-1]
            return 0, {"status": filtered_objects.status}
        return 1, {"detail": "order not found"}
    except Exception as e:
        logger.error(msg=f"{e.args}", exc_info=e)
        return 2, None

def get_only_succeeded_orders(qs, serializer):
    try:
        params = {"limit": 50}

        filter_objects = (list(filter(
            lambda x: x.id in [str(qs_object.payment_id) for qs_object in qs] and x.status == 'succeeded',
            [payment_obj for payment_obj in Payment.list(params=params).items]
        )))

        qs.filter(payment_id__in=[fo.id for fo in filter_objects]).update(status='succeeded')

        new_qs = qs.filter(status='succeeded')

        data = serializer(new_qs, many=True).data

        return True, data
    except Exception as e:
        logger.error(msg=f"{e.args}", exc_info=e)
        return False

def refund_whole_order(rq, data, serializer, **kwargs):
    try:
        serializer = serializer(data=data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        reason = data.get('reason', None)
        order_id = kwargs.get('store_order_id', None)
        if order_id:
            order: order_models.Order = order_models.Order.objects.filter(second_id=order_id).first()

            if order and order.status == 'processing' or 'completed':
                payment_data_from_backend = models.Payment.objects.filter(store_order_id=order_id).first()
                payment_id = str(payment_data_from_backend.payment_id)

                refund = Refund.create({
                    "amount": {
                        "value": Decimal(order.total_price()),
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

                    return 0, data
                else:
                    return 1, {"detail": "order didn't refund"}
            return 2, {"detail": "order not found"}
        return 3, {"detail": "no data"}
    except Exception as e:
        logger.error(msg=f"{e.args}", exc_info=e)
        return 4, None

def refund_partial(rq, data, serializer, **kwargs):
    try:
        serializer = serializer(data=data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        stock_item_id = data.get('stock_item_id', None)
        quantity = data.get('quantity', None)
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

                partial_refund = Refund.create({
                    "amount": {
                        "value": Decimal(stock_item_price * quantity),
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
                        payment_data_from_backend.status = 'refunded'
                        order.refund_reason = 'refunded'
                        order.status = 'refunded'
                        order.non_refundable = True

                    order.save()
                    data = order_serializers.OrderSerializer(order).data
                    return 0, data

                return 0, {"detail": "an order has been partial refunded", "status": partial_refund.status}
            return 1, {"detail": "order not found"}
        return 2, {"detail": "no data"}
    except Exception as e:
        logger.error(msg=f"{e.args}", exc_info=e)
        return 3, None

