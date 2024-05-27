from decimal import Decimal

from django.conf import settings

from store import models as store_models
from store import serializers as store_serializers


class Cart:
    def __init__(self, request):
        """
        CART INIT
        """
        self.session = request.session
        cart = self.session.get(settings.CART_SESSION_ID)

        if not cart:
            cart = self.session[settings.CART_SESSION_ID] = {}
        self.cart = cart

    def save(self):
        self.session.modified = True

    def add_item(self, item_id, color_id, size_id, quantity=1, override_quantity=False):
        quantity = int(quantity)
        stock = store_models.Stock.objects.filter(
            item__id=item_id,
            color__id=color_id,
            size__id=size_id,
        ).first()

        stock_id = str(stock.id)

        if stock_id not in self.cart:
            self.cart[stock_id] = {
                'quantity': 0,
                'price': str(stock.item.price),
            }

        if stock.decrease_stock(quantity=quantity):
            self.cart[stock_id]['quantity'] += quantity

        self.save()
        return stock_id

    def change_quantity(self, stock_id, quantity=1, increase=False, override_quantity=False):
        stock = store_models.Stock.objects.filter(pk=stock_id).first()
        stock_id = str(stock.id)
        quantity_in_cart = self.cart[stock_id]['quantity']

        if not increase:
            if stock.decrease_stock(quantity=quantity):
                self.cart[stock_id]['quantity'] += quantity
                self.cart[stock_id]['price'] = str(
                    Decimal(stock.item.price) * self.cart[stock_id]['quantity'])
        else:
            if quantity_in_cart > 0:
                stock.increase_stock(quantity=quantity)
                self.cart[stock_id]['quantity'] -= quantity
                self.cart[stock_id]['price'] = str(
                    Decimal(stock.item.price) * self.cart[stock_id]['quantity'])

                if self.cart[stock_id]['quantity'] == 0:
                    del self.cart[stock_id]

        self.save()

    def remove_item(self, stock_id, has_ordered=False):
        stock_id = str(stock_id)
        if stock_id in self.cart:
            quantity = int(self.cart[stock_id]['quantity'])
            del self.cart[stock_id]

            if not has_ordered:
                stock = store_models.Stock.objects.get(pk=stock_id)
                stock.increase_stock(quantity=quantity)
                stock.save()

            self.save()

    def __iter__(self):
        stock_ids = self.cart.keys()
        stock_items = store_models.Stock.objects.filter(id__in=stock_ids)
        cart = self.cart.copy()

        for stock in stock_items:
            cart[str(stock.id)]["stock"] = store_serializers.StockSerializer(stock).data

        for item in cart.values():
            item['price'] = Decimal(item['price'])
            item["total_price"] = str(Decimal(item['price']) * item['quantity'])
            yield item

    def __getitem__(self, stock_item_id):
        stock_item_id = str(stock_item_id)
        stock = store_models.Stock.objects.get(pk=stock_item_id)

        cart_item = self.cart.get(stock_item_id)

        if cart_item:
            cart_item["stock"] = store_serializers.StockSerializer(stock).data
            return self.cart[stock_item_id]

        return {}

    def __len__(self):
        return sum(item["quantity"] for item in self.cart.values())

    def get_total_price(self):
        return sum(Decimal(item["price"]) for item in self.cart.values())

    def get_total_quantity(self):
        return sum(item['quantity'] for item in self.cart.values())

    def clear(self, has_ordered=False):
        if not has_ordered:
            for item in self.cart.values():
                quantity = int(item['quantity'])
                stock = store_models.Stock.objects.get(pk=item['stock']['id'])
                stock.increase_stock(quantity=quantity)
                stock.save()

        del self.session[settings.CART_SESSION_ID]
        self.save()
