from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from django.templatetags.static import static
from order import models as order_models


def send_email_test(request, fake_order_id, msg_type, text):
    user = request.user
    order = order_models.Order.objects.get(pk=fake_order_id)
    current_site = get_current_site(request)
    subject = f'Timshee store | order: {order.order_number}'

    message = None
    template = 'templates/stuff/templates/message_template.html'
    match msg_type:
        case 'processing':
            pass
        case 'delivered':
            pass
        case 'partial_refunded':
            pass
        case 'refunded':
            pass
        case 'canceled':
            pass

    if settings.DEBUG:
        logo_url = f"http://{current_site.domain}{static('static/stuff/static/img/img.png')}"
    else:
        logo_url = f"https://{current_site.domain}{static('static/stuff/static/img/img.png')}"

    context = {
        'message': message,
        "static_url": settings.STATIC_URL,
        "media_url": settings.MEDIA_URL,
        "logo_url": logo_url,
    }

    html_message = render_to_string(template, context)
    to = order.shipping_address.email if isinstance(user, AnonymousUser) else user.email
    email = EmailMessage(subject, html_message, to=[to])
    email.content_subtype = 'html'
    email.send()

def send_email(request, order_id, msg_type, text):
    user = request.user
    order = order_models.Order.objects.get(pk=order_id)
    current_site = get_current_site(request)
    subject = f'Timshee store | order: {order.order_number}'

    message = None
    template = 'templates/stuff/templates/message_template.html'
    match msg_type:
        case 'processing':
            pass
        case 'delivered':
            pass
        case 'partial_refunded':
            pass
        case 'refunded':
            pass
        case 'canceled':
            pass

    if settings.DEBUG:
        logo_url = f"http://{current_site.domain}{static('static/stuff/static/img/img.png')}"
    else:
        logo_url = f"https://{current_site.domain}{static('static/stuff/static/img/img.png')}"

    context = {
        'message': message,
        "static_url": settings.STATIC_URL,
        "media_url": settings.MEDIA_URL,
        "logo_url": logo_url,
    }

    html_message = render_to_string(template, context)
    to = order.shipping_address.email if isinstance(user, AnonymousUser) else user.email
    email = EmailMessage(subject, html_message, to=[to])
    email.content_subtype = 'html'
    email.send()
