import re

from colorfield import fields
from auxiliaries.auxiliaries_methods import calculate_discount as calc_discount
from django.core.exceptions import ValidationError

from django.db import models
from django.core.validators import FileExtensionValidator


# Create your models here.


class Logo(models.Model):
    name = models.CharField(max_length=120)
    logo = models.ImageField(
        upload_to="product_images/logos/",
        validators=[FileExtensionValidator(["png", "jpg", "jpeg"])],
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Logo"
        verbose_name_plural = "Logos"


class Type(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Тип товара")
    category = models.ForeignKey('Category', on_delete=models.CASCADE, null=True, blank=True,
                                 verbose_name="Код категории")

    def __str__(self):
        return f"Type: {self.name}, {self.category}"

    class Meta:
        verbose_name = 'Type'
        verbose_name_plural = 'Types'


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя категории")
    category_image = models.ImageField(
        upload_to="product_images/category_images/",
        verbose_name="Изображение категории",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"Category: {self.name}"

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


def validation_link(value):
    pattern = r'^\w+-\w+-\d{4}(?:-\d{4})?$'
    if not re.match(pattern, value):
        raise ValidationError(
            f'Ссылка "{value}" не соответствует формату. '
            f'Она должна состоять из двух слов, разделенных горизонтальной чертой, '
            f'и одного или двух годов, также разделенных горизонтальной чертой. '
            f'Например: "autumn-winter-2024-2025".'
        )


class Collection(models.Model):
    name = models.CharField(max_length=100, verbose_name="Коллекция")
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
        return f"Collection: {self.name}"

    class Meta:
        verbose_name = "Collection"
        verbose_name_plural = "Collections"


class Item(models.Model):
    GENDER_CHOICES = (
        ("M", "Male"),
        ("F", "Female"),
        ("U", "Unisex"),
    )

    name = models.CharField(max_length=100, default="Без имени", verbose_name="Имя")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, verbose_name="Пол")
    sizes_colors = models.ManyToManyField('SizeColor', through='ItemSizeColor', related_name="items")
    type = models.ForeignKey(Type, on_delete=models.CASCADE, verbose_name="Тип товара", null=True, blank=True)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, verbose_name="Коллекция")
    description = models.TextField(default="", verbose_name="Описание")
    price = models.DecimalField(default=0, max_digits=10, decimal_places=2, verbose_name="Цена")
    discount = models.DecimalField(default=0, max_digits=5, decimal_places=2, verbose_name="Скидка в процентах")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество на складе")
    image = models.ImageField(
        upload_to="product_images/item_images/",
        verbose_name="Изображение", validators=[FileExtensionValidator(
            allowed_extensions=["jpg", "jpeg", "png"])
        ],
        null=True
    )

    def __str__(self):
        return f"Id: {self.id}, Name: {self.name}, Quantity: {self.quantity}, {self.type}, {self.collection}"

    def calculate_discount(self):
        discount = self.discount
        price = self.price

        return calc_discount(price, discount, quantity=1)

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"


class Size(models.Model):
    name = models.CharField(max_length=4)

    def __str__(self):
        # return f"Size: {self.name}"
        return f"{self.name}"

    class Meta:
        verbose_name = "Size"
        verbose_name_plural = "Sizes"


class SizeColor(models.Model):
    size = models.ForeignKey("Size", on_delete=models.CASCADE, null=True, blank=True)
    color = models.ForeignKey("Color", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.size}, {self.color}"

    class Meta:
        verbose_name = 'Size and color'
        verbose_name_plural = 'Sizes and colors'

        unique_together = (('size', 'color'),)


class Color(models.Model):
    name = models.CharField(max_length=256, unique=True)
    hex = fields.ColorField(default='#FF0000', verbose_name="Цвет")

    def __str__(self):
        return f"Color: {self.name}"

    class Meta:
        verbose_name = 'Color'
        verbose_name_plural = 'Colors'


class ItemSizeColor(models.Model):
    size_color = models.ForeignKey(SizeColor, on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0, verbose_name="Количество товаров этого размера и цвета")

    def __str__(self):
        return (f"[{self.size_color}], "
                f"[{self.item}], [Quantity: "
                f"{self.quantity}]")

    class Meta:
        verbose_name = 'Item size colors'
        verbose_name_plural = 'Item size colors'
        unique_together = (("size_color", "item"),)


class RoundImage(models.Model):
    """It needs for make merry-go-round of images in an internet-store"""
    item = models.ForeignKey(
        Item,
        related_name="round_images",
        on_delete=models.CASCADE,
        verbose_name="Картинка товара",
        null=True,
        blank=True
    )
    image = models.ImageField(
        upload_to="product_images/1/",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])]
    )

    def __str__(self):
        return self.image.name

    class Meta:
        verbose_name = "Round Image"
        verbose_name_plural = "Round Images"
