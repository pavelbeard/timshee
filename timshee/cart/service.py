from decimal import Decimal

from django.conf import settings
from django.db.models import Q

from store import models as store_models
from order import models as order_models
from store import serializers as store_serializers


class Cart:
    def __init__(self, request):
        """
        CART INIT
        """
        self.request = request
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)

        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = {}
        self.cart = cart

    def __create_order(self):
        if 'order_id' in self.cart:
            return self.cart['order_id']

        order = order_models.Order.objects.filter(
            Q(status="created") | Q(status="pending_for_payment")
        ).first() or order_models.Order.objects.create(
            session_key=self.request.session.session_key,
        )

        self.cart['order_id'] = {
            "id": order.id,
            "number": order.order_number
        }
        self.cart['order'] = {}
        self.save()

    def __update_ordered_items(self):
        items = list(self.__iter__())
        ordered_items = {
            "data": items,
            "total_price": self.get_total_price(),
            "total_quantity": self.get_total_quantity(),
        }

        order_number = self.cart['order_id']["number"]
        order = order_models.Order.objects.get(order_number=order_number)
        order.ordered_items = ordered_items
        order.save()

    def save(self):
        self.session.modified = True

    def add_item(self, item_id, color_id, size_id, quantity=1, override_quantity=False):
        quantity = int(quantity)
        stock = store_models.Stock.objects.filter(
            item__id=item_id,
            color__id=color_id,
            size__id=size_id,
        ).first()

        self.__create_order()

        stock_id = str(stock.id)

        if stock_id not in self.cart['order']:
            self.cart['order'][stock_id] = {
                'quantity': 0,
                'price': str(stock.item.price),
            }

        if stock.decrease_stock(quantity=quantity):
            self.cart['order'][stock_id]['quantity'] += quantity

        self.__update_ordered_items()
        self.save()
        return stock_id

    def change_quantity(self, stock_id, quantity=1, increase=False, override_quantity=False):
        if not self.cart.get('order_id'):
            return

        stock = store_models.Stock.objects.filter(pk=stock_id).first()
        stock_id = str(stock.id)
        quantity_in_cart = self.cart['order'][stock_id]['quantity']

        if not increase:
            if stock.decrease_stock(quantity=quantity):
                self.cart['order'][stock_id]['quantity'] += quantity
                self.cart['order'][stock_id]['price'] = str(
                    Decimal(stock.item.price) * self.cart['order'][stock_id]['quantity'])
        else:
            if quantity_in_cart > 0:
                stock.increase_stock(quantity=quantity)
                self.cart['order'][stock_id]['quantity'] -= quantity
                self.cart['order'][stock_id]['price'] = str(
                    Decimal(stock.item.price) * self.cart['order'][stock_id]['quantity'])

                if self.cart['order'][stock_id]['quantity'] == 0:
                    del self.cart['order'][stock_id]

        self.__update_ordered_items()
        self.save()

    def remove_item(self, stock_id, has_ordered=False):
        if not self.cart.get('order_id'):
            return

        stock_id = str(stock_id)
        if 'order' in self.cart:
            quantity = int(self.cart['order'][stock_id]['quantity'])
            del self.cart['order'][stock_id]

            if not has_ordered:
                stock = store_models.Stock.objects.get(pk=stock_id)
                stock.increase_stock(quantity=quantity)
                stock.save()

            self.__update_ordered_items()
            self.save()

    def __iter__(self):
        if not self.cart.get('order_id'):
            return

        stock_ids = self.cart['order'].keys()
        stock_items = store_models.Stock.objects.filter(id__in=stock_ids)
        cart = self.cart.copy()

        for stock in stock_items:
            cart['order'][str(stock.id)]["stock"] = store_serializers.StockSerializer(stock).data

        for item in cart['order'].values():
            item['price'] = str(Decimal(item['price']))
            item["total_price"] = str(Decimal(item['price']) * item['quantity'])
            yield item

    def __getitem__(self, stock_item_id):
        if not self.cart.get('order_id'):
            return

        stock_item_id = str(stock_item_id)
        stock = store_models.Stock.objects.get(pk=stock_item_id)

        cart_item = self.cart['order'].get(stock_item_id)

        if cart_item:
            cart_item["stock"] = store_serializers.StockSerializer(stock).data
            return self.cart['order'][stock_item_id]

        return {}

    def __len__(self):
        if not self.cart.get('order_id'):
            return

        return sum(item["quantity"] for item in self.cart['order'].values())

    def get_total_price(self):
        if not self.cart.get('order_id'):
            return

        return str(sum(Decimal(item["price"]) for item in self.cart['order'].values()))

    def get_total_quantity(self):
        if not self.cart.get('order_id'):
            return

        return sum(item['quantity'] for item in self.cart['order'].values())

    def get_order_id(self):
        if not self.cart.get('order_id'):
            return

        return self.cart['order_id']['id']

    def clear(self, has_ordered=False):
        if not self.cart.get('order_id'):
            return

        if not has_ordered:
            for item in self.cart['order'].values():
                quantity = int(item['quantity'])
                stock = store_models.Stock.objects.get(pk=item['stock']['id'])
                stock.increase_stock(quantity=quantity)
                stock.save()

        del self.cart['order']
        del self.cart['order_id']
        del self.session[settings.CART_SESSION_ID]
        self.save()
