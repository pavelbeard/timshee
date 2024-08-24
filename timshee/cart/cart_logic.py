from django.contrib.sessions.models import Session
from django.db import IntegrityError, transaction
from django.db.models import Q, Sum
from order import models as order_models
from store import models as store_models
from . import models

from auxiliaries import auxiliaries_methods
logger = auxiliaries_methods.get_logger(__name__)


class CartManager:
    """Class for manage identification of cart instance and order"""
    def __init__(self, rq):
        self.request = rq

        if self.request.user.is_authenticated:
            self.user = self.request.user
        else:
            self.user = None

        if self.request.COOKIES.get('sessionid'):
            self.session = Session.objects.filter(session_key=self.request.COOKIES.get('sessionid')).first()
        else:
            self.session = None

    def get_user(self):
        return self.user

    def get_session(self):
        return self.session

    def get_cart(self):
        cart = models.Cart.objects.filter(
            Q(user=self.user) |
            Q(session=self.session)
        ).first()
        return cart

    def get_cart_items(self):
        cart_items = models.CartItem.objects.filter(
            cart=self.get_cart()
        )
        return cart_items

    def get_order(self):
        order = order_models.Order.objects.filter(
            Q(user=self.user) |
            Q(session=self.session)
        ).first()
        return order

    def get_or_create_order(self):
        # TO CREATE ORDER
        o = order_models.Order
        excluded_statuses = [o.CANCELLED, o.DELIVERED, o.COMPLETED, o.REFUNDED, o.PARTIAL_REFUNDED]
        order = o.objects.filter(
            Q(session=self.session) |
            Q(user=self.user)
        ).exclude(status__in=excluded_statuses).first()

        # TO CREATE ORDER!
        # if isn't there an order - create it
        if not order:
            order = order_models.Order(
                user=self.user,
                session=self.session,
            )
            order.save()

        return order



def add_to_cart(rq, serializer_data) -> bool:
    """
    Add an item to cart and order
    :param rq: REQUEST FOR CART MANAGER
    :param serializer_data: DATA FOR DELETE AN ITEM FROM CART AND ORDER
    :return: IF TRUE - OK, ELSE RETURNS FALSE BECAUSE HAVE EXCEEDED LIMIT OF ITEMS IN THE CART
     AND ENDPOINT WILL RETURN 400
    """
    data = {k: v for k, v in serializer_data.items() if k != 'quantity'}
    quantity = serializer_data['quantity']
    stock = store_models.Stock.objects.filter(**data).first()

    cart_manager = CartManager(rq)
    user = cart_manager.get_user()
    session = cart_manager.get_session()

    # isn't there a cart - create it
    cart = cart_manager.get_cart()
    if not cart:
        cart = models.Cart.objects.create(
            user=user,
            session=session,
            total=0,
        )

    try:
        with transaction.atomic():
            created = False
            cart_item = models.CartItem.objects.create(
                cart=cart,
                stock_item=stock,
                quantity=quantity,
            )
            created = True
    except IntegrityError:
        cart_item = models.CartItem.objects.filter(
            cart=cart,
        )

    # if we're having some order_item - add him to cart and decrease stock
    # and if cart total items <= 10
    if cart.total_items <= 10:
        # if created one - add to cart
        if created:
            cart.cart_items.add(cart_item)
        # else - update his quantity
        else:
            cart_item.quantity += quantity
        cart_item.stock_item.decrease_stock(quantity)
        cart.total_items += quantity
        cart.total += cart_item.stock_item.item.price * cart_item.quantity
        cart_item.save()
        cart.save()
        return True
    else:
        return False

def change_quantity(rq, serializer_data) -> int:
    """
    Changes quantity of item in a cart.
    :param rq: REQUEST FOR CART MANAGER
    :param serializer_data: DATA FOR DELETE AN ITEM FROM CART
    :return: IF 0 - OK, ELSE IF 1 IT SIGNS USER HAS EXCEEDED LIMIT OF PRODUCTS IN THE CART
    AND ENDPOINT WILL RETURN 400, ELSE 2 IT SIGNS VICE VERSA
    """
    cart_manager = CartManager(rq)
    stock_id = serializer_data['stock_id']
    quantity = serializer_data['quantity']
    increase = serializer_data['increase']

    cart = cart_manager.get_cart()
    cart_item = cart.cart_items.filter(stock_item__id=stock_id).first()

    if increase and cart.total_items + quantity <= 10:
        cart_item.quantity += quantity
        cart_item.stock_item.decrease_stock(quantity)
        cart.total_items += quantity
        cart.total += cart_item.stock_item.item.price * quantity
    elif not increase and cart.total_items - quantity >= 0:
        cart_item.quantity -= quantity
        cart_item.stock_item.increase_stock(quantity)
        cart.total_items -= quantity
        cart.total -= cart_item.stock_item.item.price * quantity
    elif increase and cart.total_items + quantity > 10:
        return 1
    elif not increase and cart.total_items - quantity < 0:
        return 2

    cart_item.save()
    cart.save()

    return 0


def remove_item(rq, serializer_data) -> bool:
    """
    Remove an item from cart and order
    :param rq: REQUEST FOR CART MANAGER
    :param serializer_data: DATA FOR DELETE AN ITEM FROM CART
    :return: IF TRUE - OK, ELSE RETURNS FALSE AND ENDPOINT WILL RETURN 400
    """
    cart_manager = CartManager(rq)
    cart = cart_manager.get_cart()
    cart_item = cart.cart_items.filter(stock_item=serializer_data['stock_id']).first()
    quantity = cart_item.quantity

    if cart.total_items - quantity >= 0:
        # deleting cart item
        cart.cart_items.remove(cart_item)
        # decreasing total items in cart
        cart.total_items -= quantity
        cart.total -= cart_item.stock_item.item.price * quantity
        # decreasing order item quantity
        cart_item.quantity -= quantity
        cart_item.save()
        # increasing stock
        cart_item.stock_item.increase_stock(quantity)
        # saving
        cart.save()
        return True

    return False


def clear_cart(rq) -> int:
    """
    That method allows to clear cart (and order depend on param <has_ordered>)
    :param rq: REQUEST FOR CART MANAGER
    :return: 0 - OK,
    """
    try:
        cart_manager = CartManager(rq)
        cart = cart_manager.get_cart()
        order = cart_manager.get_order()
        cart_items = cart.cart_items.all()
        cart.total_items = 0
        cart.total = 0

        for cart_item in cart_items:
            if not cart.ordered:
                cart_item.stock_item.increase_stock(cart_item.quantity)

            cart.cart_items.remove(cart_item)
            cart_item.delete()
            cart.save()

            if not cart.ordered and order:
                order.order_item.remove(cart_item.stock_item)

        if not cart.ordered:
            order.delete()


    except Exception as e:
        logger.exception(msg=f'Something went wrong... in {clear_cart.__name__}', exc_info=e)
        return 1

    return 0

def add_cart_items_to_order(rq):
    try:
        cart_manager = CartManager(rq)
        cart = cart_manager.get_cart()
        order = cart_manager.get_or_create_order()
        cart_items = cart.cart_items.all()

        exists_id = order.order_item.filter(item_id__in=[ci.stock_item.id for ci in cart_items])
        if len(exists_id) == 0:
            for cart_item in cart_items:
                order_models.OrderItem.objects.create(
                    order=order,
                    item=cart_item.stock_item,
                    quantity=cart_item.quantity,
                )

        return order.second_id
    except Exception as e:
        logger.exception(msg=f'Something went wrong... in {add_cart_items_to_order.__name__}', exc_info=e)
        return False
