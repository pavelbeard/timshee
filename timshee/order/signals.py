from datetime import timedelta

from django.conf import settings
from django.db.models import QuerySet
from django.db.models.signals import pre_save
from django.dispatch import receiver
from django.templatetags.static import static
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from auxiliaries.auxiliaries_methods import send_email
from payment import models as payment_models
from . import models
from .order_logic import _refund_context


@receiver(pre_save, sender=models.Address)
def set_as_primary_address(sender, instance, **kwargs):
    if instance.as_primary:
        models.Address.objects.filter(user=instance.user, as_primary=True).update(as_primary=False)


@receiver(pre_save, sender=models.Order)
def set_orders_as_non_refundable(sender, instance, **kwargs):
    seven_days_ago = timezone.now() - timedelta(days=7)
    filtered_orders = models.Order.objects.filter(created_at__lt=seven_days_ago.date())
    filtered_orders.update(non_refundable=True)


@receiver(pre_save, sender=models.Order)
def order_status_for_mail(sender, instance: models.Order, **kwargs):
    current_site = settings.SITE_NAME
    usrid = instance.user.email if instance.user else instance.shipping_address.email

    if instance.status == models.Order.PROCESSING:
        order_items_annotated: QuerySet[models.OrderItem] = instance.orderitem_set.all()
        order_items = []
        for order_item in order_items_annotated:
            image = f'{current_site}{static(order_item.item.item.image)}'
            name = order_item.item.item.name
            price = order_item.item.item.price
            gender = order_item.item.item.gender.lower()
            item_id = order_item.item.item.id
            size = order_item.item.size.value
            color = order_item.item.color.name
            order_item_dict = {
                'image': image,
                'name': name,
                'price': price,
                'size': size,
                'color': color,
                'quantity': order_item.quantity,
                'link': f"{settings.CLIENT_REDIRECT}{gender}/shop/products/{item_id}?size={size}&color={color}",
                'go_to_item': _(f'Go to {name} page')
            }
            order_items.append(order_item_dict)

        context = {
            'text': {
                'p1': _('Your payment status is: '),
                'status': payment_models.Payment.STATUS_CHOICES.get(payment_models.SUCCEEDED),
            },
            'your_items': _('Your items:'),
            'order_items': order_items,
            'items_price': f'{_("Products price")}: {instance.items_total_price()}',
            'shipping_price': f'{_("Shipping price")}: {instance.shipping_price()}',
            'total_price': f'{_("Total price")}: {instance.total_price()}',
            'go_to_order': _('Go to order'),
            'order_link': f'{settings.CLIENT_REDIRECT}orders/{instance.second_id}/detail',
        }

        send_email(
            current_site=current_site,
            subject=_(f'Order {instance.order_number} status is: {models.Order.STATUS_CHOICES.get(models.Order.PROCESSING)}.'),
            template='templates/order_mjml/templates/order_status.mjml',
            to=usrid,
            context=context,
        )
    elif instance.status == models.Order.DELIVERED:
        context = {
            'text': {
                'p1': _('Your order has been delivered'),
                'message': _('See you until next purchases!')
            }
        }

        send_email(
            current_site=current_site,
            subject=_(f'Order status is: {instance.status}'),
            template='templates/order_mjml/templates/order_status.mjml',
            to=usrid,
            context=context,
        )
    elif instance.status == models.Order.REFUNDED:
        _refund_context(
            current_site=settings.SITE_NAME,
            order=instance,
            payment_status=payment_models.Payment.STATUS_CHOICES.get(payment_models.REFUNDED),
            order_status=instance.STATUS_CHOICES.get(instance.REFUNDED)
        )
    elif instance.status == models.Order.PARTIAL_REFUNDED:
        returned_item: models.ReturnedItem = instance.returneditem_set.objects.first()
        stock_item_price = returned_item.item.item.price
        quantity = returned_item.quantity
        _refund_context(
            current_site=settings.SITE_NAME,
            order=instance,
            payment_status=payment_models.Payment.STATUS_CHOICES.get(payment_models.PARTIAL_REFUNDED),
            order_status=models.Order.STATUS_CHOICES.get(instance.PARTIAL_REFUNDED),
            refunded_items=[
                {
                    'image': f'{current_site}{returned_item.item.item.image}',
                    'name': returned_item.item.item.name,
                    'price': returned_item.item.item.price,
                    'size': returned_item.item.size.value,
                    'color': returned_item.item.color.name,
                    'quantity': returned_item.quantity,
                }
            ],
            refunded_price={'refunded_price': stock_item_price * quantity}
        )