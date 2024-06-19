import random
import string

from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.db import models
from parler.models import TranslatableModel
from store import models as store_models


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
    session_key = models.CharField(max_length=40, blank=True, null=True)
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
    STATUS_CHOICES = (
        ('created', 'CREATED'),
        ('pending_for_pay', 'PENDING FOR PAY'),
        ('processing', 'PROCESSING'),
        ('delivering', 'DELIVERING'),
        ('delivered', 'DELIVERED'),
        ('completed', 'COMPLETED'),
        ('partial_refunded', 'PARTIAL_REFUNDED'),
        ('cancelled', 'CANCELLED'),
        ('refunded', 'REFUNDED'),
    )

    order_number = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    session_key = models.CharField(max_length=40, blank=True, null=True)
    ordered_items = models.JSONField(blank=True, null=True)
    order_item = models.ManyToManyField(store_models.Stock, through="OrderItem")
    shipping_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True)
    shipping_method = models.ForeignKey("ShippingMethod", on_delete=models.CASCADE, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    refund_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (f"[OrderID: {self.order_number}] [Status: {self.status}] "
                f"[Created: {self.created_at}] [Updated: {self.updated_at}]")

    def save(self, *args, **kwargs):
        # with transaction.atomic():
        if self.pk is None:
            # order_number_obj, created = OrderNumber.objects.select_for_update().get_or_create(pk=1)
            order_number_obj, created = OrderNumber.objects.get_or_create(pk=1)
            if not created:
                order_number_obj.last_order_id += 1
                order_number_obj.save()

            self.order_number = (f"{order_number_obj.last_order_id}"
                                 f"{''.join(random.choice(string.ascii_uppercase) for _ in range(6))}")

        return super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True)
    item = models.ForeignKey(store_models.Stock, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    refund_reason = models.CharField(max_length=255, blank=True, null=True, choices=Order.STATUS_CHOICES)

    def __str__(self):
        return f"[Order: {self.order}] [Item: {self.item}] [Quantity: {self.quantity}]"

    def save(self, *args, **kwargs):
        if self.quantity == 0 and self.order.status not in ["processing", "completed", "partial_refunded", "refunded"]:
            self.delete()
        else:
            return super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Order Item"
        verbose_name_plural = "Order Items"
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
