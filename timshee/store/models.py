import re
from decimal import Decimal

from colorfield import fields
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.core.validators import FileExtensionValidator


# Create your models here.


def validation_link(value):
    pattern = r'^\w+-?\w+-?\d{4}(?:-\d{4})?$'
    if not re.match(pattern, value):
        raise ValidationError(
            _(f'Ссылка') + f"{value}" + _(' не соответствует формату. ' +
            'Она должна состоять из двух слов, разделенных горизонтальной чертой, ' +
            'и одного или двух годов, также разделенных горизонтальной чертой, ' +
            'либо одного слова без черты но с годом/годами.') +
            f"{_('Например: ')}" + "home2024" + _('или') + "autumn-winter-2024-2025."
        )


class Size(models.Model):
    value = models.CharField(max_length=50, unique=True, null=False, blank=False)

    def __str__(self):
        return self.value

    class Meta:
        verbose_name = _('Size')
        verbose_name_plural = _('Sizes')


class Color(models.Model):
    name = models.CharField(max_length=50, unique=True, null=False, blank=False)
    hex = fields.ColorField()

    def __str__(self):
        return f"[{self.name}]"

    class Meta:
        verbose_name = _('Color')
        verbose_name_plural = _('Colors')
        unique_together = (('name', 'hex'),)


class Collection(models.Model):
    name = models.CharField(max_length=100, verbose_name=_("Коллекция"), unique=True, null=False, blank=False)
    collection_image = models.ImageField(
        upload_to="product_images/1/collection_images/",
        verbose_name=_("Изображение коллекции"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        null=True,
    )
    link = models.CharField(
        max_length=256,
        validators=[validation_link],
        verbose_name=_("Ссылка на коллекцию"),
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
        verbose_name = _("Collection")
        verbose_name_plural = _("Collections")


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name=_("Имя категории"), unique=True, null=False, blank=False)
    code = models.CharField(max_length=100, verbose_name=_("Код категории"), unique=True, null=False, blank=False)
    types = models.ManyToManyField("Type", related_name="category_types")
    category_image = models.ImageField(
        upload_to="product_images/1/category_images/",
        verbose_name=_("Изображение категории"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        null=True, blank=True,
    )
    category_image_women = models.ImageField(
        upload_to="product_images/1/category_images/women",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
    )
    category_image_men = models.ImageField(
        upload_to="product_images/1/category_images/men",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
    )
    category_image_unisex = models.ImageField(
        upload_to="product_images/1/category_images/unisex",
        blank=True,
        null=True,
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
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
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")


class Type(models.Model):
    name = models.CharField(max_length=50, unique=True, null=False, blank=False)
    code = models.CharField(max_length=50, unique=True, null=False, blank=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"[{self.name}]"

    class Meta:
        verbose_name = _('Type')
        verbose_name_plural = _('Types')


class Stock(models.Model):
    item = models.ForeignKey("Item", on_delete=models.CASCADE)
    size = models.ForeignKey("Size", on_delete=models.CASCADE)
    color = models.ForeignKey("Color", on_delete=models.CASCADE)
    in_stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return (f"[{_('Stock')}: {self.item}] [Size: {self.size}] [Color: {self.color}] "
                f"[{_('InStock')}: {self.in_stock}]")

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
        verbose_name = _('Stock')
        verbose_name_plural = _('Stocks')
        unique_together = (("item", "size", "color"),)


class CarouselImage(models.Model):
    """It needs for make merry-go-round of images in an internet-store"""
    item = models.ForeignKey("Item", on_delete=models.CASCADE)
    image = models.ImageField(
        upload_to="product_images/1/carousel_images/",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        null=False,
        blank=False,
    )

    def __str__(self):
        return self.image.name

    class Meta:
        verbose_name = _("Carousel Image")
        verbose_name_plural = _("Carousel Images")


class Item(models.Model):
    WOMEN = 'women'
    MEN = 'men'
    UNISEX = 'unisex'
    MISC = 'misc'
    GENDER_CHOICES = {
        WOMEN: _('WOMEN'),
        MEN: _('MEN'),
        UNISEX: _('UNISEX'),
        MISC: _('MISC'),
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
        upload_to="product_images/1/item_images/",
        verbose_name=_("Изображение"),
        validators=[FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png", "webp"])]
    )

    def __str__(self):
        return f"[{_('Item')}: {self.name}] [ID: {self.id}] [{_('Price')}: {self.price}] [{_('Discount')}: {self.discount}] "

    def calculate_discount(self):
        if self.discount > 0.0:
            return f"{Decimal((self.price - (self.price / 100 * self.discount))):.2f}"

        return None

    class Meta:
        verbose_name = _("Item")
        verbose_name_plural = _("Items")


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, blank=True, null=True)
    stock = models.ForeignKey("Stock", on_delete=models.CASCADE, related_name="stock_set")
    stock_link = models.CharField(max_length=250, blank=False, null=False)

    def __str__(self):
        return f"[Item: {self.stock}]"

    class Meta:
        verbose_name = _("Wishlist")
        verbose_name_plural = _("Wishlist items")
