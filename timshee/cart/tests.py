from http.client import responses

from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.db.models.expressions import result
from django.test import TestCase
from rest_framework import status
from rest_framework.reverse import reverse
from order.models import Order, Address, Country, Province, CountryPhoneCode, ShippingMethod
from store.models import Item, Stock, Size, Color, Type, Category, Collection, CarouselImage

from . import models

User = get_user_model()


# Create your tests here.

class TestCart(TestCase):
    def setUp(self):
        new_collection = Collection.objects.create(name='TEST COLLECTION', collection_image='test.jpg',
                                                   link='test-collection-2024-2025')
        new_category = Category.objects.create(name='TEST CATEGORY', category_image='test.jpg', code='test-category')
        new_size = Size.objects.create(value='40-50')
        new_size2 = Size.objects.create(value='40-48')
        new_color = Color.objects.create(name='TEST COLOR', hex='#FFFFFF')
        new_color2 = Color.objects.create(name='TEST COLOR2', hex='#FFF000')
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
        new_stock2 = Stock.objects.create(item=new_item, size=new_size2, color=new_color2, in_stock=10)
        self.stock = new_stock
        self.stock2 = new_stock2
        new_item.sizes.set([new_size, new_size2])
        new_item.colors.set([new_color, new_color2])
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
        # new_order.order_item.set([new_stock])
        # new_order.save()
        self.instance = new_order
        user = User(
            username='testuser@testuser.com',
            email='testuser@testuser.com',
        )
        user.set_password('Rt3$YiOO')
        user.save()
        self.user = user

        login_data = {
            'username': self.user.username,
            'password': 'Rt3$YiOO'
        }

        url = reverse('signin')
        response = self.client.post(url, login_data, format='json')
        self.csrftoken = response.cookies['csrftoken'].value
        self.access_token = response.cookies['access_token'].value


        self.create_cart_url = reverse('cart-add-item')

    def test_add_item_to_cart(self):
        item_data = {
            'item_id': 1,
            'size_id': 1,
            'color_id': 1,
            'quantity': 1,
        }
        headers = {
            'X-CSRFToken': self.csrftoken,
            'Authorization': 'Bearer {0}'.format(self.access_token),
        }

        response = self.client.post(self.create_cart_url, data=item_data, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response2 = self.client.post(self.create_cart_url, data=item_data, headers=headers)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

        add_to_order = reverse('cart-add-to-order')
        response3 = self.client.post(add_to_order, headers=headers)
        self.assertEqual(response3.status_code, status.HTTP_201_CREATED)

    def test_change_quantity(self):
        data = {
            'stock_id': 1,
            'quantity': 1,
            'increase': False
        }

        headers = {
            'X-CSRFToken': self.csrftoken,
            'Authorization': 'Bearer {0}'.format(self.access_token),
        }

        cart = models.Cart.objects.create(user=self.user, total=self.stock.item.price)
        cart_item = models.CartItem.objects.create(cart=cart, stock_item=self.stock)
        cart_item.quantity += 1
        cart_item.save()
        cart.cart_items.add(cart_item)
        cart.total_items += 1
        cart.save()

        change_url = reverse('cart-change-quantity')
        response = self.client.put(change_url, data=data, headers=headers, content_type='application/json')

        print(models.Cart.objects.first().total_items)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_remove_item_from_cart(self):
        cart = models.Cart.objects.create(user=self.user, total=0)

        ci1 = models.CartItem(
            cart=cart,
            stock_item=self.stock,
            quantity=1
        )
        ci2 = models.CartItem(
            cart=cart,
            stock_item=self.stock2,
            quantity=1
        )
        ci1.save()
        ci2.save()
        cart_items = models.CartItem.objects.all()
        total_price = cart_items.aggregate(total=Sum('stock_item__item__price'))['total']
        total_quantity = cart_items.aggregate(total=Sum('quantity'))['total']
        cart.cart_items.set(cart_items)
        cart.total_items += total_quantity
        cart.total = total_price
        cart.save()

        cart_remove = reverse('cart-remove')
        headers = {
            'X-CSRFToken': self.csrftoken,
            'Authorization': 'Bearer {0}'.format(self.access_token),
        }
        response = self.client.delete(cart_remove, data={
            'stock_id': cart_items.first().stock_item.id
        }, content_type='application/json', headers=headers)

        response2 = self.client.delete(cart_remove, data={
            'stock_id': cart_items.last().stock_item.id
        }, content_type='application/json', headers=headers)

        print(models.Cart.objects.first().total_items)
        print(models.Cart.objects.last().total_items)


        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


    def test_clear_cart(self):
        cart = models.Cart.objects.create(user=self.user, total=0)

        ci1 = models.CartItem(
            cart=cart,
            stock_item=self.stock,
            quantity=1
        )
        ci2 = models.CartItem(
            cart=cart,
            stock_item=self.stock2,
            quantity=1
        )
        ci1.save()
        ci2.save()
        cart_items = models.CartItem.objects.all()
        total_price = cart_items.aggregate(total=Sum('stock_item__item__price'))['total']
        total_quantity = cart_items.aggregate(total=Sum('quantity'))['total']
        cart.cart_items.set(cart_items)
        cart.total_items += total_quantity
        cart.total = total_price
        cart.save()

        clear_cart = reverse('cart-clear-cart')
        headers = {
            'X-CSRFToken': self.csrftoken,
            'Authorization': 'Bearer {0}'.format(self.access_token),
        }

        response = self.client.delete(
            clear_cart,
            headers=headers,
            data={'has_ordered': False},
            content_type='application/json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)