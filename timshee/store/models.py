import re
from decimal import Decimal

from colorfield import fields
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.core.exceptions import ValidationError

from django.db import models
from django.core.validators import FileExtensionValidator


# Create your models here.


def validation_link(value):
    pattern = r'^\w+-?\w+-?\d{4}(?:-\d{4})?$'
    if not re.match(pattern, value):
        raise ValidationError(
            f'Ссылка "{value}" не соответствует формату. '
            f'Она должна состоять из двух слов, разделенных горизонтальной чертой, '
            f'и одного или двух годов, также разделенных горизонтальной чертой, '
            f'либо одного слова без черты но с годом/годами.'
            f'Например: "home2024" или "autumn-winter-2024-2025".'
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
    show_in_welcome_page = models.BooleanField(default=True)

    def __str__(self):
        return f"[{self.name}]"

    def __collection_link_builder(self):
        S = 's'
        A = 'a'
        W = 'w'
        collection_code = {
            S: ['spring', 'summer'],
            A: 'autumn',
            W: 'winter'
        }
        link = ''
        match_ = re.findall(r'\w+\d{4}\/\d{4}|\w+\d{4}', self.name)
        if self.name[0] == S:
            link += collection_code[S][0]
        if self.name[1] == S:
            link += f"-{collection_code[S][1]}-"
        if self.name[0] == A:
            link += collection_code[A]
        if self.name[1] == W:
            link += f"-{collection_code[W]}-"
        if match_:
            link += f"{'-'.join(re.split(r'\/|\+s', match_[0]))}"

        if link == '':
            return self.name.replace(' ', '-').lower()

        return link

    def save(self, *args, **kwargs):
        if self.name:
            self.link = self.__collection_link_builder()
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Collection"
        verbose_name_plural = "Collections"


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя категории", unique=True, null=False, blank=False)
    code = models.CharField(max_length=100, verbose_name="Код категории", unique=True, blank=False, null=False)
    types = models.ManyToManyField("Type", related_name="category_types")
    category_image = models.ImageField(
        upload_to="product_images/category_images/",
        verbose_name="Изображение категории",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
    )
    category_image_women = models.ImageField(
        upload_to="product_images/category_images/women",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
    )
    category_image_men = models.ImageField(
        upload_to="product_images/category_images/men",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
    )
    category_image_unisex = models.ImageField(
        upload_to="product_images/category_images/unisex",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
    )
    # it needs for causes, when we have some products for home or smth
    apply_gender = models.BooleanField(default=True)

    def __str__(self):
        return f"[{self.name}]"

    def save(self, *args, **kwargs):
        if self.name:
            self.code = "-".join([w.lower() for w in self.name.split()])

        super().save(*args, **kwargs)

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
    in_stock = models.PositiveIntegerField(default=0)

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
        self.in_stock += int(quantity)
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
    WOMEN = 'women'
    MEN = 'men'
    UNISEX = 'unisex'
    MISC = 'misc'
    GENDER_CHOICES = {
        WOMEN: 'WOMEN',
        MEN: 'MEN',
        UNISEX: 'UNISEX',
        MISC: 'MISC',
    }

    name = models.CharField(max_length=50)
    gender = models.CharField(max_length=6, blank=True, null=True, choices=GENDER_CHOICES)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    sizes = models.ManyToManyField("Size", through='Stock')
    colors = models.ManyToManyField("Color", through='Stock')
    type = models.ForeignKey(Type, on_delete=models.CASCADE)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    discount = models.DecimalField(max_digits=4, decimal_places=2, default=0.0)
    image = models.ImageField(
        upload_to="product_images/item_images/",
        verbose_name="Изображение",
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"])]
    )

    def __str__(self):
        return f"[Item: {self.name}] [ID: {self.id}] [Price: {self.price}] [Discount: {self.discount}] "

    def calculate_discount(self):
        if self.discount > 0.0:
            return f"{Decimal((self.price - (self.price / 100 * self.discount))):.2f}"

        return None

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, blank=True, null=True)
    stock = models.ForeignKey("Stock", on_delete=models.CASCADE)
    stock_link = models.CharField(max_length=250, blank=False, null=False)

    def __str__(self):
        return f"[Item: {self.stock}]"

    class Meta:
        verbose_name = "Wishlist"
        verbose_name_plural = "Wishlist items"
