from types import SimpleNamespace
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.db.models import Q, Sum, F
from django.template.loader import render_to_string
from django.templatetags.static import static
from django.utils.translation import gettext_lazy as _
from order import models as order_models


class ReducedOrderItem:
    def __init__(self, quantity, image, size, color):
        self.quantity = quantity
        self.image = image
        self.size = size
        self.color = color

    def __repr__(self):
        return f"price={self.price} - image={self.image} - size={self.size} - color={self.color}"


def send_test_email(request, order_id, msg_type):
    user = request.user
    order = order_models.Order.objects.get(pk=order_id)
    current_site = SimpleNamespace(domain="localhost:8113", name="localhost:8113")
    subject = f'Timshee store | order: {order.order_number}'

    message = None
    template = 'templates/stuff/templates/message_template.html'
    order_items = []

    add_item = lambda x: order_items.append(ReducedOrderItem(
        quantity=x.quantity,
        image=f"http://{current_site.domain}{settings.MEDIA_URL}{x.item.item.image}",
        size=x.item.size.value,
        color=x.item.color.name
    ))

    items_total_price = order.orderitem_set.aggregate(total=Sum(F('quantity') * F('item__item__price')))[
        'total']
    shipping_price = order.orderitem_set.values('order__shipping_method__price').distinct()

    if shipping_price:
        shipping_price = shipping_price[0]['order__shipping_method__price']
    else:
        shipping_price = 0

    total_price = items_total_price + shipping_price if items_total_price else shipping_price

    ordered_items = order.orderitem_set
    match msg_type:
        case 'processing':
            for item in ordered_items.all():
                add_item(x=item)
            message = _(f'Your order {order.order_number} is in processing. Thank you for purchasing!')
        case 'delivering':
            message = _(f'Your order {order.order_number} is in delivering.')
        case 'delivered':
            for item in ordered_items.all():
                add_item(x=item)
            message = _(f'Your order {order.order_number} is delivered!')
        case 'partial_refunded':
            for item in ordered_items.exclude(Q(refund_reason="") | Q(refund_reason=None)):
                add_item(x=item)
            message = _(f'Your order {order.order_number} is partially refunded!')
        case 'refunded':
            message = _(f'Your order {order.order_number} is refunded!')
        case 'canceled':
            message = f'Your order {order.order_number} is canceled!'

    if settings.DEBUG:
        logo_url = f"http://{current_site.domain}{static('static/stuff/static/img/img.png')}"
    else:
        logo_url = f"https://{current_site.domain}{static('static/stuff/static/img/img.png')}"

    context = {
        'message': message,
        "static_url": settings.STATIC_URL,
        "media_url": settings.MEDIA_URL,
        "logo_url": logo_url,
        "ordered_items": order_items,
        "your_items": _("Your items:"),
        "order_following_text1": _("To track the status of your order follow for that"),
        "order_following_text2": _("link"),
        "order_link": f"{settings.CLIENT_REDIRECT}orders/{order.id}/detail",
        "total_price": total_price,
        "items_total_price": items_total_price,
        "shipping_price": shipping_price,
    }

    html_message = render_to_string(template, context)
    print(html_message)
    email = EmailMessage(subject, html_message, to=['heavycream9090@icloud.com'])
    email.content_subtype = 'html'
    return email.send()


def send_email(request, order_id, msg_type):
    user = request.user
    order = order_models.Order.objects.get(pk=order_id)
    current_site = get_current_site(request)
    subject = f'Timshee store | order: {order.order_number}'

    message = None
    template = 'templates/stuff/templates/message_template.html'
    order_items = []

    add_item = lambda x: order_items.append(ReducedOrderItem(
        quantity=x.item.quantity,
        image=f"http://{current_site.domain}{settings.MEDIA_URL}{x.item.item.image}",
        size=x.item.size.value,
        color=x.item.color.name
    ))

    items_total_price = order.orderitem_set.aggregate(total=Sum(F('quantity') * F('item__item__price')))[
        'total']
    shipping_price = order.orderitem_set.values('order__shipping_method__price').distinct()

    if shipping_price:
        shipping_price = shipping_price[0]['order__shipping_method__price']
    else:
        shipping_price = 0

    total_price = items_total_price + shipping_price if items_total_price else shipping_price

    ordered_items = order.orderitem_set
    match msg_type:
        case 'processing':
            for item in ordered_items.all():
                add_item(x=item)
            message = _(f'Твой заказ {order.order_number} в процессе сборки.  Спасибо за покупку!')
        case 'delivering':
            message = _(f'Твой заказ {order.order_number} в процессе доставки.')
        case 'delivered':
            for item in ordered_items.all():
                add_item(x=item)
            message = _(f'Твой заказ {order.order_number} доставлен!')
        case 'partial_refunded':
            for item in ordered_items.exclude(Q(refund_reason="") | Q(refund_reason=None)):
                add_item(x=item)
            message = _(f'Твой заказ {order.order_number} частично возвращен')
        case 'refunded':
            message = _(f'Твой заказ {order.order_number} возвращен!')
        case 'canceled':
            message = f'Твой заказ {order.order_number} отменен!'

    if settings.DEBUG:
        logo_url = f"http://{current_site.domain}{static('static/stuff/static/img/img.png')}"
    else:
        logo_url = f"https://{current_site.domain}{static('static/stuff/static/img/img.png')}"

    context = {
        'message': message,
        "static_url": settings.STATIC_URL,
        "media_url": settings.MEDIA_URL,
        "logo_url": logo_url,
        "ordered_items": order_items,
        "your_items": _("Your items:"),
        "order_following_text1": _("Чтобы отследить статус твоего заказа"),
        "order_following_text2": _("перейди по этой ссылке"),
        "order_link": f"{settings.CLIENT_REDIRECT}orders/{order.id}/detail",
        "total_price": total_price,
        "items_total_price": items_total_price,
        "shipping_price": shipping_price,
    }

    html_message = render_to_string(template, context)
    to = order.shipping_address.email if isinstance(user, AnonymousUser) else user.email
    email = EmailMessage(subject, html_message, to=[to])
    email.content_subtype = 'html'
    email.send()
