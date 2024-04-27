import uuid

from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.db import models

from cart.models import CartItem, AnonymousCartItem


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
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
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
        return f"{self.address1}, {self.city.name}"


class Order(models.Model):
    STATUS_CHOICES = (
        ('created', 'CREATED'),
        ('pending_for_pay', 'PENDING FOR PAY'),
        ('processing', 'PROCESSING'),
        ('completed', 'COMPLETED'),
        ('cancelled', 'CANCELLED'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cart_items = models.ManyToManyField(CartItem)
    shipping_address = models.ForeignKey(Address, on_delete=models.CASCADE, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_for_pay')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (f"[OrderID: {self.id}] [Status: {self.status}] "
                f"[Created: {self.created_at}] [Updated: {self.updated_at}]"
                f"")


class AnonymousAddress(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    session = models.OneToOneField(Session, on_delete=models.CASCADE, blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20)
    email = models.EmailField(max_length=254)
    phone_code = models.ForeignKey(CountryPhoneCode, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    additional_data = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Anonymous address"
        verbose_name_plural = "Anonymous addresses"

    def __str__(self):
        return f"{self.address1}, {self.city.name}"


class AnonymousOrder(models.Model):
    STATUS_CHOICES = (
        ('created', 'CREATED'),
        ('pending_for_pay', 'PENDING FOR PAY'),
        ('processing', 'PROCESSING'),
        ('completed', 'COMPLETED'),
        ('cancelled', 'CANCELLED'),
    )

    session = models.ForeignKey(Session, on_delete=models.CASCADE, blank=True, null=True)
    cart_items = models.ManyToManyField(AnonymousCartItem)
    shipping_address = models.ForeignKey(AnonymousAddress, on_delete=models.CASCADE, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_for_pay')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (f"[OrderID: {self.id}] [Status: {self.status}] "
                f"[Created: {self.created_at}] [Updated: {self.updated_at}]"
                f"")

    class Meta:
        verbose_name = 'Anonymous order'
        verbose_name_plural = 'Anonymous orders'
