from colorfield import fields
from auxiliaries.auxiliaries_methods import calculate_discount as calc_discount

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
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

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
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class Collection(models.Model):
    name = models.CharField(max_length=100, verbose_name="Коллекция")
    collection_image = models.ImageField(
        upload_to="product_images/collection_images/",
        verbose_name="Изображение коллекции",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png"])],
        null=True,
    )

    def __str__(self):
        return self.name

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
    color = fields.ColorField(default='#FF0000', verbose_name="Цвет")
    sizes = models.ManyToManyField('Size', through='ItemSize', related_name="items")
    type = models.ForeignKey(Type, on_delete=models.CASCADE, verbose_name="Тип товара", null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категория")
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
        return f"{self.id} - {self.quantity} - {self.category} - {self.collection}"

    def calculate_discount(self):
        discount = self.discount
        price = self.price

        return calc_discount(price, discount, quantity=1)

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"


class Size(models.Model):
    size = models.CharField(max_length=4, unique=True)

    def __str__(self):
        return self.size

    class Meta:
        verbose_name = 'Size'
        verbose_name_plural = 'Sizes'


class ItemSize(models.Model):
    size = models.ForeignKey(Size, on_delete=models.CASCADE, null=True, blank=True)
    item = models.ForeignKey(Item, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"{self.size} - {self.item}"


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
