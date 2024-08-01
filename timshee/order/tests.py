from django.contrib.auth.models import User
from django.test import TestCase

from order.models import Order, Address, Country, Province, CountryPhoneCode, ShippingMethod
from store.models import Item, Stock, Size, Color, Type, Category, Collection, CarouselImage
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
        new_collection = Collection.objects.create(name='TEST COLLECTION', collection_image='test.jpg',
                                                   link='test-collection-2024-2025')
        new_category = Category.objects.create(name='TEST CATEGORY', category_image='test.jpg', code='test-category')
        new_size = Size.objects.create(value='40-50')
        new_color = Color.objects.create(name='TEST COLOR', hex='#FFFFFF')
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
        new_item.sizes.set([new_size])
        new_item.colors.set([new_color])
        new_item.save()

        new_carousel_images = CarouselImage.objects.create(image='test.jpg', item=new_item)
        # new_item.carousel_images.set([new_carousel_images])
        # new_item.save()

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
        new_order.order_item.set([new_stock])
        new_order.save()
        self.instance = new_order
        user = User(
            username='testuser@testuser.com',
            email='testuser@testuser.com',
        )
        user.set_password('Rt3$YiOO')
        user.save()
        self.user = user

    def test_last_orders_without_user(self):
        url = reverse('order-get-last-order-by-user')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_new_order(self):
        print(self.instance)
