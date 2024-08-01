import logging
from decimal import Decimal

from django.conf import settings
from django.db.models import Q, Sum

from store import models as store_models
from order import models as order_models
from store import serializers as store_serializers


logger = logging.getLogger(__name__)


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
            session_key=self.request.COOKIES.get('sessionid'),
        )

        if self.request.user.is_authenticated:
            order.user = self.request.user

        self.cart['order_id'] = {
            "id": order.second_id,
            "number": order.order_number,
        }
        self.cart['order'] = {}
        self.save()

    def save(self):
        self.session.modified = True

    def add_item(self, item_id, color_id, size_id, quantity=1, override_quantity=False):
        quantity = int(quantity)
        self.__create_order()

        order_item, created = order_models.OrderItem.objects.get_or_create(
            order_id=self.cart['order_id']['id'],
            item_id=store_models.Stock.objects.get(
                item__id=item_id,
                color__id=color_id,
                size__id=size_id,
            ).id,
            quantity=quantity,
        )

        stock_id = str(order_item.item.id)

        if stock_id not in self.cart['order']:
            self.cart['order'][stock_id] = {
                'quantity': 0,
                'price': str(order_item.item.item.price),
            }

        self.cart['order'][stock_id]['quantity'] += quantity
        order_quantity_total = int(
            order_models.Order.objects.get(
                second_id=self.cart['order_id']["id"]).orderitem_set.all().aggregate(quantity=Sum('quantity'))['quantity']
        )
        if created and order_quantity_total < 10:
            order_item.item.decrease_stock(quantity=quantity)
        elif not created and order_item.item.decrease_stock(quantity=quantity) and order_quantity_total < 10:
            order_item.quantity += quantity
            order_item.save()

        self.save()
        return order_item.item.id

    def change_quantity(self, stock_id, quantity=1, increase=False, override_quantity=False):
        if not self.cart.get('order_id'):
            return

        order_item = order_models.OrderItem.objects.get(
            order_id=self.cart['order_id']['id'],
            item_id=stock_id,
        )

        stock_id = str(order_item.item.id)
        quantity_in_cart = int(self.cart['order'][stock_id]['quantity'])

        order_quantity_total = int(
            order_models.Order.objects.get(
                second_id=self.cart['order_id']["id"]).orderitem_set.all().aggregate(quantity=Sum('quantity'))['quantity']
        )
        if not increase:
            if order_item.item.decrease_stock(quantity=quantity) and order_quantity_total < 10:
                order_item.quantity += quantity
                self.cart['order'][stock_id]['quantity'] += quantity
                self.cart['order'][stock_id]['price'] = str(
                    Decimal(order_item.item.item.price) * self.cart['order'][stock_id]['quantity'])

        else:
            if quantity_in_cart > 0:
                order_item.item.increase_stock(quantity=quantity)
                order_item.quantity -= quantity
                self.cart['order'][stock_id]['quantity'] -= quantity
                self.cart['order'][stock_id]['price'] = str(
                    Decimal(order_item.item.item.price) * self.cart['order'][stock_id]['quantity'])

                if self.cart['order'][stock_id]['quantity'] == 0:
                    del self.cart['order'][stock_id]

        order_item.save()

        self.save()

    def remove_item(self, stock_id, has_ordered=False):
        if not self.cart.get('order_id'):
            return

        stock_id = str(stock_id)
        if 'order' in self.cart:
            quantity = int(self.cart['order'][stock_id]['quantity'])
            del self.cart['order'][stock_id]

            if not has_ordered:
                order_item = order_models.OrderItem.objects.get(
                    order_id=self.cart['order_id']['id'],
                    item__id=stock_id,
                )
                order_item.item.increase_stock(quantity=quantity)
                order_item.quantity -= quantity
                order_item.save()

            # self.__update_ordered_items(quantity, stock_id, decrease_stock=False)
            self.save()

    def __iter__(self):
        if not self.cart.get('order_id'):
            return

        stock_ids = self.cart['order'].keys()

        # new logic
        order_items = order_models.OrderItem.objects.filter(
            order_id=self.cart['order_id']['id'],
            item_id__in=stock_ids
        )
        cart = self.cart.copy()

        for order_item in order_items:
            cart['order'][str(order_item.item.id)]["stock"] = store_serializers.StockSerializer(order_item.item).data
            cart['order'][str(order_item.item.id)]["stock"] = {
                **cart['order'][str(order_item.item.id)]["stock"],
                "order_item_id": order_item.id
            }

        for item in cart['order'].values():
            item['price'] = str(Decimal(item['price']))
            item["total_price"] = str(Decimal(item['price']) * item['quantity'])
            yield item

    def __getitem__(self, stock_item_id):
        if not self.cart.get('order_id'):
            return

        stock_item_id = str(stock_item_id)
        order_item = order_models.OrderItem.objects.get(
            order_id=self.cart['order_id']['id'],
            item_id=stock_item_id
        )
        cart_item = self.cart['order'].get(stock_item_id)

        if cart_item:
            cart_item["stock"] = store_serializers.StockSerializer(order_item.item).data
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
            try:
                for item in self.cart['order'].values():
                    quantity = int(item['quantity'])
                    order_item = order_models.OrderItem.objects.get(
                        order_id=self.cart['order_id']['id'],
                        item_id=item['stock']['id']
                    )
                    order_item.item.increase_stock(quantity=quantity)
                    order_item.quantity -= quantity
                    order_item.save()
            except order_models.OrderItem.DoesNotExist as e:
                logger.error(e)

        del self.cart['order']
        del self.cart['order_id']
        del self.session[settings.CART_SESSION_ID]
        self.save()
