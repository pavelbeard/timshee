import uuid

from django.contrib.auth.models import User
from django.db import models

from cart.models import CartItem


# Create your models here.

class Country(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name


class CountryPhoneCode(models.Model):
    country = models.OneToOneField(Country, on_delete=models.CASCADE, primary_key=True)
    phone_code = models.CharField(max_length=10)

    class Meta:
        verbose_name = "Country Phone Code"
        verbose_name_plural = "Country Phone Codes"

    def __str__(self):
        return f"{self.country.name} (+{self.phone_code})"


class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)

    class Meta:
        verbose_name = "City"
        verbose_name_plural = "Cities"

    def __str__(self):
        return f"{self.name}, {self.country.name}"


class Address(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    street = models.CharField(max_length=255)
    interior = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20)
    email = models.EmailField(max_length=254)
    phone_code = models.ForeignKey(CountryPhoneCode, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    additional_data = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Address"
        verbose_name_plural = "Addresses"

    def __str__(self):
        return f"{self.street}, {self.city.name}"


class Order(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = (
        ('created', 'CREATED'),
        ('pending', 'PENDING'),
        ('processing', 'PROCESSING'),
        ('completed', 'COMPLETED'),
        ('cancelled', 'CANCELLED'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.ManyToManyField(CartItem)
    shipping_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.uuid)

    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

# class OrderItem(models.Model):
#     order = models.ForeignKey(Order, on_delete=models.CASCADE)
#     item = models.ForeignKey(Item, on_delete=models.CASCADE)
#     quantity = models.PositiveIntegerField(default=1)
#
#     def __str__(self):
#         return self.item.name
