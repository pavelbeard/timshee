from colorfield import fields
from auxiliaries.auxiliaries_methods import calculate_discount as calc_discount

from django.db import models
from django.core.validators import FileExtensionValidator


# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Имя категории")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class Collection(models.Model):
    name = models.CharField(max_length=100, verbose_name="Коллекция")

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
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name="Категория")
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, verbose_name="Коллекция")
    description = models.TextField(default="", verbose_name="Описание")
    price = models.DecimalField(default=0, max_digits=10, decimal_places=2, verbose_name="Цена")
    discount = models.DecimalField(default=0, max_digits=5, decimal_places=2, verbose_name="Скидка в процентах")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Количество на складе")
    image = models.ImageField(
        upload_to="product_images/",
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
