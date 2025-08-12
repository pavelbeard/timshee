"""
Catalog models - refactored and improved from the original store app.
"""

import re

from colorfield import fields
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from src.utils.models import TimestampMixin, UserSessionMixin, SingletonModel


def validate_collection_link(value):
    """
    Validate collection link format.
    """
    pattern = r'^\w+-?\w+-?\d{4}(?:-\d{4})?$'
    if not re.match(pattern, value):
        raise ValidationError(
            _('Link does not match the required format. ') +
            _('It should consist of words separated by hyphens and one or two years. ') +
            _('For example: autumn-winter-2024-2025 or home2024.')
        )


class CollectionLinkBuilder:
    """
    Builder class for generating collection links.
    """
    
    def __init__(self, name, link=None):
        self.name = name.lower()
        self.link = link

    def build_link(self):
        """
        Build collection link from name if not provided.
        """
        if self.link:
            return self.link

        collection_code = {
            's': ['spring', 'summer'],
            'a': 'autumn',
            'w': 'winter'
        }

        link = ''
        years = re.findall(r'\d{4}', self.name)

        # Handle season codes
        if self.name and self.name[0] in collection_code:
            first_char = self.name[0]
            if first_char == 's':
                link += '-'.join(collection_code[first_char])
            else:
                link += collection_code[first_char]

        # Handle second character
        if len(self.name) > 1 and self.name[1] in collection_code:
            second_char = self.name[1]
            if second_char == 's':
                link += f"-{collection_code[second_char][1]}"
            elif second_char == 'w':
                link += f"-{collection_code[second_char]}"

        # Add years
        if years:
            if len(years) == 2:
                link += f"-{years[0]}-{years[1]}"
            elif len(years) == 1:
                link += f"-{years[0]}"

        return link if link else self.name.replace(' ', '-')


class Size(TimestampMixin, models.Model):
    """
    Product size model.
    """
    value = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name=_("Size value")
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Sort order")
    )

    class Meta:
        verbose_name = _('Size')
        verbose_name_plural = _('Sizes')
        ordering = ['sort_order', 'value']

    def __str__(self):
        return self.value


class Color(TimestampMixin, models.Model):
    """
    Product color model.
    """
    name = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name=_("Color name")
    )
    hex = fields.ColorField(verbose_name=_("Hex color"))
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active")
    )

    class Meta:
        verbose_name = _('Color')
        verbose_name_plural = _('Colors')
        unique_together = (('name', 'hex'),)

    def __str__(self):
        return f"[{self.name}]"


class Collection(TimestampMixin, models.Model):
    """
    Product collection model.
    """
    name = models.CharField(
        max_length=100, 
        unique=True, 
        verbose_name=_("Collection name")
    )
    description = models.TextField(
        blank=True,
        verbose_name=_("Description")
    )
    link = models.CharField(
        max_length=256,
        validators=[validate_collection_link],
        verbose_name=_("Collection link"),
        null=True,
        blank=True
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active")
    )
    show_in_welcome_page = models.BooleanField(
        default=True,
        verbose_name=_("Show in welcome page")
    )
    
    # Images for different categories
    main_image = models.ImageField(
        upload_to="collections/main/",
        verbose_name=_("Main image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        null=True,
        blank=True
    )
    men_image = models.ImageField(
        upload_to="collections/men/",
        verbose_name=_("Men's image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        blank=True,
        null=True
    )
    women_image = models.ImageField(
        upload_to="collections/women/",
        verbose_name=_("Women's image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        blank=True,
        null=True
    )
    unisex_image = models.ImageField(
        upload_to="collections/unisex/",
        verbose_name=_("Unisex image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = _("Collection")
        verbose_name_plural = _("Collections")
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.name and not self.link:
            link_builder = CollectionLinkBuilder(self.name, self.link)
            self.link = link_builder.build_link()
        super().save(*args, **kwargs)


class Category(TimestampMixin, models.Model):
    """
    Product category model.
    """
    name = models.CharField(
        max_length=100, 
        unique=True, 
        verbose_name=_("Category name")
    )
    code = models.CharField(
        max_length=100, 
        unique=True, 
        verbose_name=_("Category code")
    )
    description = models.TextField(
        blank=True,
        verbose_name=_("Description")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active")
    )
    apply_gender = models.BooleanField(
        default=True,
        verbose_name=_("Apply gender categorization")
    )
    
    # Category images
    main_image = models.ImageField(
        upload_to="categories/main/",
        verbose_name=_("Main image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        null=True,
        blank=True
    )
    women_image = models.ImageField(
        upload_to="categories/women/",
        verbose_name=_("Women's image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        blank=True,
        null=True
    )
    men_image = models.ImageField(
        upload_to="categories/men/",
        verbose_name=_("Men's image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        blank=True,
        null=True
    )
    unisex_image = models.ImageField(
        upload_to="categories/unisex/",
        verbose_name=_("Unisex image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.name and not self.code:
            self.code = "-".join([w.lower() for w in self.name.split()])
        super().save(*args, **kwargs)


class ProductType(TimestampMixin, models.Model):
    """
    Product type model.
    """
    name = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name=_("Type name")
    )
    code = models.CharField(
        max_length=50, 
        unique=True, 
        verbose_name=_("Type code")
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE,
        related_name='types',
        verbose_name=_("Category")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active")
    )

    class Meta:
        verbose_name = _('Product Type')
        verbose_name_plural = _('Product Types')
        ordering = ['name']

    def __str__(self):
        return f"[{self.name}]"

    def save(self, *args, **kwargs):
        if self.name and not self.code:
            self.code = "-".join([w.lower() for w in self.name.split()])
        super().save(*args, **kwargs)


class Product(TimestampMixin, models.Model):
    """
    Main product model.
    """
    GENDER_CHOICES = [
        ('women', _('Women')),
        ('men', _('Men')),
        ('unisex', _('Unisex')),
        ('misc', _('Miscellaneous')),
    ]

    name = models.CharField(
        max_length=200, 
        verbose_name=_("Product name")
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        verbose_name=_("Slug")
    )
    description = models.TextField(verbose_name=_("Description"))
    additional_info = models.TextField(
        blank=True, 
        verbose_name=_("Additional information")
    )
    
    # Categorization
    gender = models.CharField(
        max_length=10, 
        choices=GENDER_CHOICES,
        blank=True, 
        null=True,
        verbose_name=_("Gender")
    )
    collection = models.ForeignKey(
        Collection, 
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name=_("Collection")
    )
    product_type = models.ForeignKey(
        ProductType, 
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name=_("Product type")
    )
    
    # Pricing
    base_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        verbose_name=_("Base price")
    )
    discount_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=0.0,
        verbose_name=_("Discount percentage")
    )
    
    # Images
    main_image = models.ImageField(
        upload_to="products/main/",
        verbose_name=_("Main image"),
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])]
    )
    
    # Status
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active")
    )
    is_featured = models.BooleanField(
        default=False,
        verbose_name=_("Is featured")
    )

    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.name}] [ID: {self.id}] [Price: {self.base_price}]"

    @property
    def discounted_price(self):
        """Calculate discounted price."""
        if self.discount_percentage > 0:
            discount_amount = self.base_price * (self.discount_percentage / 100)
            return self.base_price - discount_amount
        return self.base_price

    @property
    def is_on_sale(self):
        """Check if product is on sale."""
        return self.discount_percentage > 0


class ProductImage(TimestampMixin, models.Model):
    """
    Additional product images for carousel.
    """
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE, 
        related_name="images",
        verbose_name=_("Product")
    )
    image = models.ImageField(
        upload_to="products/gallery/",
        validators=[FileExtensionValidator(["jpg", "jpeg", "png", "webp"])],
        verbose_name=_("Image")
    )
    alt_text = models.CharField(
        max_length=255,
        blank=True,
        verbose_name=_("Alt text")
    )
    sort_order = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Sort order")
    )

    class Meta:
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")
        ordering = ['sort_order']

    def __str__(self):
        return f"{self.product.name} - Image {self.id}"


class ProductVariant(TimestampMixin, models.Model):
    """
    Product variant model (combination of product, size, and color).
    """
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE,
        related_name='variants',
        verbose_name=_("Product")
    )
    size = models.ForeignKey(
        Size, 
        on_delete=models.CASCADE,
        verbose_name=_("Size")
    )
    color = models.ForeignKey(
        Color, 
        on_delete=models.CASCADE,
        verbose_name=_("Color")
    )
    sku = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_("SKU")
    )
    stock_quantity = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Stock quantity")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is active")
    )

    class Meta:
        verbose_name = _('Product Variant')
        verbose_name_plural = _('Product Variants')
        unique_together = (("product", "size", "color"),)

    def __str__(self):
        return f"{self.product.name} - {self.size.value} - {self.color.name}"

    def decrease_stock(self, quantity=1):
        """Decrease stock quantity."""
        if self.stock_quantity >= quantity:
            self.stock_quantity -= quantity
            self.save()
            return True
        return False

    def increase_stock(self, quantity=1):
        """Increase stock quantity."""
        self.stock_quantity += quantity
        self.save()

    @property
    def is_in_stock(self):
        """Check if variant is in stock."""
        return self.stock_quantity > 0

    def save(self, *args, **kwargs):
        if not self.sku:
            # Generate SKU if not provided
            self.sku = f"{self.product.id}-{self.size.value}-{self.color.name}".upper()
        super().save(*args, **kwargs)


class Wishlist(UserSessionMixin, TimestampMixin, models.Model):
    """
    User wishlist model.
    """
    variant = models.ForeignKey(
        ProductVariant, 
        on_delete=models.CASCADE, 
        related_name="wishlists",
        verbose_name=_("Product variant")
    )

    class Meta:
        verbose_name = _("Wishlist Item")
        verbose_name_plural = _("Wishlist Items")
        unique_together = [
            ['user', 'variant'],
            ['session', 'variant']
        ]

    def __str__(self):
        user_info = self.user.username if self.user else f"Session: {self.session.session_key[:8]}"
        return f"[{user_info}] - {self.variant}"


class CurrencyRate(SingletonModel):
    """
    Currency exchange rates for international pricing.
    """
    euro_rate = models.DecimalField(
        max_digits=8, 
        decimal_places=4, 
        default=1.0,
        verbose_name=_("Euro rate")
    )
    usd_rate = models.DecimalField(
        max_digits=8, 
        decimal_places=4, 
        default=1.0,
        verbose_name=_("USD rate")
    )
    last_updated = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Last updated")
    )

    class Meta:
        verbose_name = _("Currency Rate")
        verbose_name_plural = _("Currency Rates")

    def __str__(self):
        return f"EUR: {self.euro_rate}, USD: {self.usd_rate}"
