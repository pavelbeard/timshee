from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.templatetags.static import static
from django.test import TestCase, RequestFactory
from django.utils.translation import gettext_lazy as _

from order import models as order_models


class CurrentSite:
    def __init__(self):
        self.domain = "localhost:8113"
        self.name = "localhost:8113"


current_site = CurrentSite()


class EmailTest(TestCase):
    databases = {"default"}
    fixtures = ['db.sqlite.json']

    def setUp(self):
        self.factory = RequestFactory()
        self.users = User.objects.all()
        self.orders = order_models.Order.objects.all()

    def check_fixtures_loaded(self):
        if not order_models.Address.objects.exists():
            raise AssertionError('Address table was not created')

    def test_rq_factory(self):
        rq = self.factory.get('/')
        current_site = get_current_site(request=rq)
        current_site_name = current_site.name
        current_site = current_site.domain
        self.assertIsNotNone(current_site)
        print(current_site)

    def test_check_email_credentials(self):
        print(settings.EMAIL_HOST_USER)
        print(settings.EMAIL_HOST_PASSWORD)

    def test_send_email(self):
        from . import services
        print([order.id for order in self.orders])
        result = services.send_email_test(
            fake_user=User.objects.get(pk=2),
            fake_order_id=3,
            msg_type="processing",
            text="test"
        )
        self.assertEqual(result, 1)

    def test_send_email_new(self):

        print(settings.EMAIL_HOST_USER)
        print(settings.EMAIL_HOST_PASSWORD)

        current_site = CurrentSite()
        if settings.DEBUG:
            logo_url = f"http://{current_site.domain}{static('static/stuff/static/img/img.png')}"
        else:
            logo_url = f"https://{current_site.domain}{static('static/stuff/static/img/img.png')}"

        message = None
        template = 'templates/stuff/templates/message_template.html'

        msg_type = 'processing'

        match msg_type:
            case 'processing':
                message = _('Your order is in processing. Thank you for purchasing!')
            case 'delivered':
                pass
            case 'partial_refunded':
                pass
            case 'refunded':
                pass
            case 'canceled':
                pass
        context = {
            'message': message,
            "static_url": settings.STATIC_URL,
            "media_url": settings.MEDIA_URL,
            "logo_url": logo_url,
            "your_items": _("Your items"),
        }

        html_message = render_to_string(template, context)
        subject = f"Timshee store | {self.orders[0].order_number}"
        to = ["heavycream9090@icloud.com"]
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.EMAIL_HOST_USER,
            to=[to]
        )
        email.content_subtype = 'html'
        result = email.send()

        self.assertEqual(result, 1)


class TemplateTestCase(TestCase):
    databases = {"default"}
    fixtures = ['db.sqlite.json']

    def setUp(self):
        self.orders = order_models.Order.objects.all()
        self.users = User.objects.all()
        self.template = 'templates/stuff/templates/message_template.html'

    def test_template_with_pics(self):
        message = _('Your order is in processing. Thank you for purchasing!')
        logo_url = f"http://{current_site.domain}{static('static/stuff/static/img/img.png')}"

        ordered_items = self.orders[0].orderitem_set.all()
        order_items = []

        class ReducedOrderItem:
            def __init__(self, price, image, size, color):
                self.price = price
                self.image = image
                self.size = size
                self.color = color

            def __repr__(self):
                return f"price={self.price} - image={self.image} - size={self.size} - color={self.color}"

        for item in ordered_items:
            order_items.append(ReducedOrderItem(
                price=item.item.item.price,
                image=f"http://{current_site.domain}{static(item.item.item.image)}",
                size=item.item.size.value,
                color=item.item.color.name
            ))

        context = {
            'message': message,
            "static_url": settings.STATIC_URL,
            "media_url": settings.MEDIA_URL,
            "logo_url": logo_url,
            "ordered_items": order_items,
        }

        html_message = render_to_string(self.template, context)
        print(html_message)
        self.assertInHTML(f"<span>{message}</span>", html_message)
        self.assertInHTML(f"<img src='{logo_url}' alt='alt-title' height='50'>", html_message)

    def test_ordered_items_values(self):
        ordered_items = self.orders[0].orderitem_set.all().values_list(
            'item__item__price', 'item__item__image', 'item__size__value', 'item__color__name'
        )
        print(ordered_items)

        orderitems = []

        class ReducedOrderItem:
            def __init__(self, price, image, size, color):
                self.price = price
                self.image = image
                self.size = size
                self.color = color

            def __repr__(self):
                return f"price={self.price} - image={self.image} - size={self.size} - color={self.color}"

        for item in ordered_items:
            orderitems.append(
                ReducedOrderItem(
                    price=item[0],
                    image=f"http://localhost:8113{static(item[1])}",
                    size=item[2],
                    color=item[3]
                )
            )

        print(orderitems)
