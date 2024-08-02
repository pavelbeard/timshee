import string

from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.db import models
from django.db.models import Sum, F
from parler.models import TranslatableModel
from shortuuid.django_fields import ShortUUIDField
from store import models as store_models
from . import services


# Create your models here.

class Continent(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"[{self.name}]"


class Country(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=5, blank=True, null=True)
    continent = models.ForeignKey(Continent, on_delete=models.CASCADE, blank=True, null=True)

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def __str__(self):
        # return f"[{self.safe_translation_getter('name', any_language=True)}]"
        return f"[{self.name}]"


class CountryPhoneCode(models.Model):
    country = models.OneToOneField(Country, on_delete=models.CASCADE, primary_key=True)
    phone_code = models.CharField(max_length=10)

    class Meta:
        verbose_name = "Country Phone Code"
        verbose_name_plural = "Country Phone Codes"

    def __str__(self):
        return f"{self.country.name} (+{self.phone_code})"


class Province(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Province"
        verbose_name_plural = "Provinces"

    def __str__(self):
        return f"[{self.name}, {self.country.name}]"


class Address(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, blank=True, null=True, on_delete=models.CASCADE)
    city = models.CharField(max_length=50)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20)
    email = models.EmailField(max_length=254)
    phone_code = models.ForeignKey(CountryPhoneCode, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    additional_data = models.TextField(blank=True, null=True)
    as_primary = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.address1}, {self.province.name} {self.city}"


class OrderNumber(models.Model):
    last_order_id = models.PositiveIntegerField(default=10000)


class Order(models.Model):
    CREATED = 'created'
    PENDING_FOR_PAY = 'pending_for_pay'
    PROCESSING = 'processing'
    DELIVERING = 'delivering'
    DELIVERED = 'delivered'
    COMPLETED = 'completed'
    PARTIAL_REFUNDED = 'partial_refunded'
    CANCELLED = 'cancelled'
    REFUNDED = 'refunded'
    STATUS_CHOICES = {
        CREATED: 'CREATED',
        PENDING_FOR_PAY: 'PENDING_FOR_PAY',
        PROCESSING: 'PROCESSING',
        DELIVERING: 'DELIVERING',
        DELIVERED: 'DELIVERED',
        COMPLETED: "COMPLETED",
        PARTIAL_REFUNDED: 'PARTIAL_REFUNDED',
        CANCELLED: 'CANCELLED',
        REFUNDED: 'REFUNDED',
    }

    second_id = ShortUUIDField(length=16, max_length=32, alphabet=string.ascii_uppercase + string.digits)
    order_number = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, blank=True, null=True, on_delete=models.CASCADE)
    order_item = models.ManyToManyField(store_models.Stock, related_name="order_items", through="OrderItem")
    returned_item = models.ManyToManyField(store_models.Stock, related_name="returned_items", through="ReturnedItem")
    shipping_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True)
    shipping_method = models.ForeignKey("ShippingMethod", on_delete=models.CASCADE, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    refund_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    non_refundable = models.BooleanField(default=False)

    def __str__(self):
        return (f"[OrderID: {self.pk}-{self.order_number}] [Status: {self.status}] "
                f"[Created: {self.created_at}] [Updated: {self.updated_at}]")

    def items_total_price(self):
        if self.order_item:
            items_total_price = self.orderitem_set.aggregate(
                total=Sum(F('quantity') * F('item__item__price'))
            )['total']
            return items_total_price
        return 0

    def shipping_price(self):
        if self.shipping_method:
            shipping_method_price = self.orderitem_set.values('order__shipping_method__price').distinct()
            if shipping_method_price:
                shipping_price = shipping_method_price[0]['order__shipping_method__price']
                return shipping_price
        return 0

    def total_price(self):
        if self.shipping_method or self.order_item:
            shipping_price = self.shipping_price()
            items_total_price = self.items_total_price()
            if items_total_price != 0 and shipping_price != 0:
                return items_total_price + shipping_price
            elif items_total_price != 0:
                return items_total_price
        return 0

    def save(self, *args, **kwargs):
        if self.pk is None:
            super().save(*args, **kwargs)

        if self.order_number is None or self.order_number == '':
            date_str = self.created_at.strftime('%Y%m%d')
            self.order_number = f"{date_str}-{services.order_number(self.second_id)}"

        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True)
    item = models.ForeignKey(store_models.Stock, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"[Order: {self.order}] [Item: {self.item}] [Quantity: {self.quantity}]"

    def save(self, *args, **kwargs):
        if self.quantity == 0:
            self.delete()
        else:
            return super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"
        unique_together = (("order", "item"),)


class ReturnedItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True)
    item = models.ForeignKey(store_models.Stock, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    refund_reason = models.CharField(max_length=255, blank=True, null=True, choices=Order.STATUS_CHOICES)

    def __str__(self):
        return f"[Order: {self.order}] [Item: {self.item}] [Quantity: {self.quantity}]"

    class Meta:
        verbose_name = "Returned Item"
        verbose_name_plural = "Returned Items"
        unique_together = (("order", "item"),)


class ShippingMethod(models.Model):
    shipping_name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    #

    def __str__(self):
        return self.shipping_name

    class Meta:
        verbose_name = 'Shipping method'
        verbose_name_plural = 'Shipping methods'
