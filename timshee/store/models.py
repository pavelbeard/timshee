import re

from colorfield import fields
from auxiliaries.auxiliaries_methods import calculate_discount as calc_discount
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from django.db import models
from django.core.validators import FileExtensionValidator


# Create your models here.


def validation_link(value):
    pattern = r'^\w+-\w+-\d{4}(?:-\d{4})?$'
    if not re.match(pattern, value):
        raise ValidationError(
            f'Ссылка "{value}" не соответствует формату. '
            f'Она должна состоять из двух слов, разделенных горизонтальной чертой, '
            f'и одного или двух годов, также разделенных горизонтальной чертой. '
            f'Например: "autumn-winter-2024-2025".'
        )


class Size(models.Model):
    value = models.CharField(max_length=50, unique=True, null=False, blank=False)

    def __str__(self):
        return self.value


class Color(models.Model):
    name = models.CharField(max_length=50, unique=True, null=False, blank=False)
    hex = fields.ColorField()

    def __str__(self):
        return f"[{self.name}]"

    class Meta:
        unique_together = (('name', 'hex'),)


class Collection(models.Model):
    name = models.CharField(max_length=100, verbose_name="Коллекция", unique=True, null=False, blank=False)
    collection_image = models.ImageField(
        upload_to="product_images/collection_images/",
        verbose_name="Изображение коллекции",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        null=True,
    )
    link = models.CharField(
        max_length=256,
        validators=[validation_link],
        verbose_name="Ссылка на коллекцию",
        null=True,
    )

    def __str__(self):
        return f"[{self.name}]"

    class Meta:
        verbose_name = "Collection"
        verbose_name_plural = "Collections"


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя категории", unique=True, null=False, blank=False)
    code = models.CharField(max_length=100, verbose_name="Код категории", unique=True, blank=False, null=False)
    category_image = models.ImageField(
        upload_to="product_images/category_images/",
        verbose_name="Изображение категории",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
    )

    def __str__(self):
        return f"[{self.name}]"

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class Type(models.Model):
    name = models.CharField(max_length=50, unique=True, null=False, blank=False)
    code = models.CharField(max_length=50, unique=True, null=False, blank=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return f"[{self.name}]"

    class Meta:
        verbose_name = 'Type'
        verbose_name_plural = 'Types'


class Stock(models.Model):
    item = models.ForeignKey("Item", on_delete=models.CASCADE)
    size = models.ForeignKey("Size", on_delete=models.CASCADE)
    color = models.ForeignKey("Color", on_delete=models.CASCADE)
    in_stock = models.PositiveIntegerField(default=1)

    def __str__(self):
        return (f"[Stock: {self.item}] [Size: {self.size}] [Color: {self.color}] "
                f"[InStock: {self.in_stock}]")

    def decrease_stock(self, quantity=1):
        if self.in_stock >= quantity:
            self.in_stock -= quantity
            self.save()
            return True
        return False

    def increase_stock(self, quantity=1):
        self.in_stock += quantity
        self.save()

    class Meta:
        verbose_name = 'Stock'
        verbose_name_plural = 'Stocks'
        unique_together = (("item", "size", "color"),)


class CarouselImage(models.Model):
    """It needs for make merry-go-round of images in an internet-store"""
    item = models.ForeignKey("Item", on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to="product_images/1/",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        null=False,
        blank=False,
    )

    def __str__(self):
        return self.image.name

    class Meta:
        verbose_name = "Carousel Image"
        verbose_name_plural = "Carousel Images"


class Item(models.Model):
    GENDER_CHOICES = (
        ("M", "Male"),
        ("F", "Female"),
        ("U", "Unisex"),
    )

    name = models.CharField(max_length=50)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    sizes = models.ManyToManyField("Size", through='Stock')
    colors = models.ManyToManyField("Color", through='Stock')
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    discount = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    image = models.ImageField(
        upload_to="product_images/item_images/",
        verbose_name="Изображение",
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])]
    )

    def __str__(self):
        return f"[Item: {self.name}] [ID: {self.id}] [Price: {self.price}] [Discount: {self.discount}] "

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    session_key = models.CharField(max_length=40, blank=True, null=True)
    stock = models.ForeignKey("Stock", on_delete=models.CASCADE)
    stock_link = models.CharField(max_length=250, blank=False, null=False)

    def __str__(self):
        return f"[Item: {self.stock}]"

    class Meta:
        verbose_name = "Wishlist"
        verbose_name_plural = "Wishlist items"
