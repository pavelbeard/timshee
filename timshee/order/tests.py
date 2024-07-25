from django.contrib.auth.models import User
from django.test import TestCase

from order.models import Order
from rest_framework import status
from rest_framework.reverse import reverse


# Create your tests here.

# paths
# admin/
# api/store/
# api/cart/
# api/order/ ^countries/$ [name='country-list']
# api/order/ ^countries\.(?P<format>[a-z0-9]+)/?$ [name='country-list']
# api/order/ ^countries/(?P<pk>[^/.]+)/$ [name='country-detail']
# api/order/ ^countries/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$ [name='country-detail']
# api/order/ ^phone-codes/$ [name='countryphonecode-list']
# api/order/ ^phone-codes\.(?P<format>[a-z0-9]+)/?$ [name='countryphonecode-list']
# api/order/ ^phone-codes/(?P<pk>[^/.]+)/$ [name='countryphonecode-detail']
# api/order/ ^phone-codes/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$ [name='countryphonecode-detail']
# api/order/ ^provinces/$ [name='province-list']
# api/order/ ^provinces\.(?P<format>[a-z0-9]+)/?$ [name='province-list']
# api/order/ ^provinces/(?P<pk>[^/.]+)/$ [name='province-detail']
# api/order/ ^provinces/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$ [name='province-detail']
# api/order/ ^addresses/$ [name='address-list']
# api/order/ ^addresses\.(?P<format>[a-z0-9]+)/?$ [name='address-list']
# api/order/ ^addresses/get_address_as_primary/$ [name='address-get-address-as-primary']
# api/order/ ^addresses/get_address_as_primary\.(?P<format>[a-z0-9]+)/?$ [name='address-get-address-as-primary']
# api/order/ ^addresses/get_addresses_by_user/$ [name='address-get-addresses-by-user']
# api/order/ ^addresses/get_addresses_by_user\.(?P<format>[a-z0-9]+)/?$ [name='address-get-addresses-by-user']
# api/order/ ^addresses/(?P<pk>[^/.]+)/$ [name='address-detail']
# api/order/ ^addresses/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$ [name='address-detail']
# api/order/ ^orders/$ [name='order-list']
# api/order/ ^orders\.(?P<format>[a-z0-9]+)/?$ [name='order-list']
# api/order/ ^orders/get_last_order_by_user/$ [name='order-get-last-order-by-user']
# api/order/ ^orders/get_last_order_by_user\.(?P<format>[a-z0-9]+)/?$ [name='order-get-last-order-by-user']
# api/order/ ^orders/get_orders_by_user/$ [name='order-get-orders-by-user']
# api/order/ ^orders/get_orders_by_user\.(?P<format>[a-z0-9]+)/?$ [name='order-get-orders-by-user']
# api/order/ ^orders/(?P<pk>[^/.]+)/$ [name='order-detail']
# api/order/ ^orders/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$ [name='order-detail']
# api/order/ ^shipping-methods/$ [name='shippingmethod-list']
# api/order/ ^shipping-methods\.(?P<format>[a-z0-9]+)/?$ [name='shippingmethod-list']
# api/order/ ^shipping-methods/(?P<pk>[^/.]+)/$ [name='shippingmethod-detail']
# api/order/ ^shipping-methods/(?P<pk>[^/.]+)\.(?P<format>[a-z0-9]+)/?$ [name='shippingmethod-detail']
# api/order/ ^$ [name='api-root']
# api/order/ ^\.(?P<format>[a-z0-9]+)/?$ [name='api-root']
# api/stuff/
# api/payment/
# api/obtain-token/
# debug/
# ^timshee/media/(?P<path>.*)$
# ^static/(?P<path>.*)$

class OrderTests(TestCase):
    def setUp(self):
        user = User(
            username='testuser@testuser.com',
            email='testuser@testuser.com',
        )
        user.set_password('Rt3$YiOO')
        user.save()
        self.order = Order.objects.create(
            session_key='sdfghjkl3456789'
        )

        self.user = user

    def test_last_orders_without_user(self):
        url = reverse('order-get-last-order-by-user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
