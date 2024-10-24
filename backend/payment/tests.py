import json
import uuid
from pprint import pprint

from django.conf import settings
from django.contrib.sessions.models import Session
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.reverse import reverse
from yookassa import Configuration

from cart.models import Cart, CartItem
from order.models import Order, Address, Country, Province, CountryPhoneCode, ShippingMethod
from store.models import Item, Stock, Size, Color, Type, Category, Collection, CarouselImage
from stuff.models import OwnerData
from . import models


# Create your tests here.

class PaymentTests(TestCase):
    def setUp(self):
        self.session = Session.objects.filter(session_key=self.client.session.session_key).first()
        new_collection = Collection.objects.create(name='TEST COLLECTION', collection_image='test.jpg',
                                                   link='test-collection-2024-2025')
        new_category = Category.objects.create(name='TEST CATEGORY', category_image='test.jpg', code='test-category')
        new_size = Size.objects.create(value='40-50')
        new_color = Color.objects.create(name='TEST COLOR', hex='#FFFFFF')
        new_color_2 = Color.objects.create(name='TEST COLOR 2', hex='#FF00FF')
        new_type = Type.objects.create(name='TEST TYPE', code='test-type', category=new_category)
        new_item = Item(
            name='TEST ITEM',
            description='TEST ITEM',
            gender='M',
            collection=new_collection,
            type=new_type,
            image='test_jpg',
            price=999.99,
        )
        new_item.save()
        new_stock = Stock.objects.create(item=new_item, size=new_size, color=new_color, in_stock=10)
        new_stock_2 = Stock.objects.create(item=new_item, size=new_size, color=new_color_2, in_stock=10)
        new_item.sizes.add(new_size)
        new_item.colors.add(new_color)
        new_item.colors.add(new_color_2)
        new_item.save()

        CarouselImage.objects.create(image='test.jpg', item=new_item)

        cart = Cart.objects.create(
            session=self.session,
        )
        CartItem.objects.create(cart=cart, stock_item=new_stock, quantity=2)
        CartItem.objects.create(cart=cart, stock_item=new_stock_2, quantity=2)
        cart.ordered = True
        cart.save()

        new_country = Country.objects.create(name='United States')
        new_province = Province.objects.create(name='Washington DC', country=new_country)
        new_phone_code = CountryPhoneCode.objects.create(phone_code="1", country=new_country)
        new_shipping_method = ShippingMethod.objects.create(shipping_name='Shipping', price=15.00)
        new_shipping_address = Address.objects.create(
            first_name='John',
            last_name='Doe',
            address1='C/ Test, 1',
            address2='2',
            postal_code='12345',
            as_primary=True,
            province=new_province,
            phone_code=new_phone_code,
            email='test@test.com',

        )
        new_order = Order(
            shipping_address=new_shipping_address,
            shipping_method=new_shipping_method,
        )
        new_order.save()
        new_order.order_item.add(new_stock)
        new_order.order_item.add(new_stock_2)
        new_order.save()
        order_item_obj = new_order.orderitem_set.all().first()
        order_item_obj_sc = new_order.orderitem_set.all().last()
        order_item_obj.quantity = 10
        order_item_obj_sc.quantity = 10
        order_item_obj.save()
        order_item_obj_sc.save()
        OwnerData.objects.create(
            full_name="Лев Иванович Толстой", email="tolstoy@yandex.ru", tax_number="164600651958",
            contact_number="79993544242"
        )

        Configuration.configure(settings.ACCOUNT_ID, settings.API_KEY)

        self.order = new_order

    def test_payment(self):
        # STEP 1, CREATE A PAYMENT - MOCK
        data = {
            "order_id": self.order.second_id,
            "order_status": 'pending_for_payment',
        }

        payment_id = str(uuid.uuid4())
        models.Payment.objects.create(
            store_order_id=self.order.second_id,
            payment_id=payment_id,
            status='succeeded',
            created_at=timezone.now(),
            captured_at=timezone.now()
        )

        # url = reverse('payment-create-payment')
        # response = self.client.post(url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # print(response.json())
        # input('Press Enter to continue...')

        # STEP 2, CHECK IT - MOCK
        # url = reverse('payment-get-status', kwargs={'store_order_id': self.order.second_id})
        # response = self.client.get(url)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.assertIn('status', response.json())
        # print(response.json())
        # data = response.json()
        payment = models.Payment.objects.filter(store_order_id=self.order.second_id).first()
        status_ = payment.status



        # STEP 3, UPDATE PAYMENT
        if status_ == 'succeeded':
            self.client.cookies['sessionid'] = self.session.session_key
            url = reverse('payment-update-payment', kwargs={'store_order_id': self.order.second_id})
            data = {'payment_status': status_, 'store_order_id': self.order.second_id}
            response = self.client.put(url, data, content_type='application/json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # STEP 4, UPDATE ORDER
            url = reverse('order-detail', kwargs={'pk': self.order.second_id})
            data = {'status': 'processing'}
            response = self.client.put(url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        elif data['status'] == 'pending':
            print("Payment couldn't pass")
            return

        refund_whole = True
        if refund_whole:
            # STEP 5.1.1, REFUND WHOLE
            data = {
                "stock_item_id": 1,
                "reason": "It didnt like",
            }
            url = reverse('refund-whole-order', kwargs={'store_order_id': self.order.second_id})
            response = self.client.put(path=url, data=json.dumps(data), format='json', headers={'Content-Type': 'application/json'})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            pprint(response.json(), indent=4)
        else:
            # STEP 5.2.1, REFUND PARTIAL
            data = {
                'stock_item_id': 1,
                'quantity': 5,
                'quantity_total': 10,
                'reason': "It didnt like",
            }
            url = reverse('payment-refund-partial', kwargs={'store_order_id': self.order.second_id})
            response = self.client.put(path=url, data=json.dumps(data), format='json', headers={'Content-Type': 'application/json'})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            print('step 5.2.1')
            pprint(response.json(), indent=4)

            # STEP 5.2.2, REFUND PARTIAL, BUT IT WILL BE FULL
            url = reverse('payment-refund-partial', kwargs={'store_order_id': self.order.second_id})
            response = self.client.put(path=url, data=json.dumps(data), format='json', headers={'Content-Type': 'application/json'})
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            print('step 5.2.2')
            pprint(response.json(), indent=4)

