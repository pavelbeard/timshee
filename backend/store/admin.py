from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.db.models import Sum
from dragndrop_related.views import DragAndDropRelatedImageMixin

from . import models, forms, store_logic
from stuff import models as stuff_models


# Register your models here.

def compress_pics_on_server() -> bool:
    dynamic_settings: stuff_models.DynamicSettings = stuff_models.DynamicSettings.objects.first()
    if not dynamic_settings:
        return False
    return dynamic_settings.compress_pics_on_server


@admin.register(models.Item)
class ItemAdmin(DragAndDropRelatedImageMixin, admin.ModelAdmin):
    related_manager_field_name = 'carousel_images'
    list_display = ('name', 'gender', 'price', 'discount', 'type__name', 'type__category__name', 'quantity')

    def quantity(self, obj: models.Item) -> int:
        q = obj.stock_set.aggregate(quantity=Sum('in_stock'))
        return q['quantity']

    class StockInLine(admin.TabularInline):
        model = models.Stock
        form = forms.StockForm

    class CarouselImageInline(admin.TabularInline):
        model = models.CarouselImage
        form = forms.CarouselImageForm

    inlines = [StockInLine, CarouselImageInline]

    def save_model(self, request, obj, form, change):
        if compress_pics_on_server():
            if obj.image:
                obj.image = store_logic.compress_image(obj.image)
        super().save_model(request, obj, form, change)


@admin.register(models.CarouselImage)
class StockImageAdmin(admin.ModelAdmin):
    list_display = ('item__name', 'image')

    def save_model(self, request, obj, form, change):
        if compress_pics_on_server():
            if obj.image:
                obj.image = store_logic.compress_image(obj.image)
        super().save_model(request, obj, form, change)


@admin.register(models.Type)
class TypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'category__name')


@admin.register(models.Size)
class SizeAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Color)
class ColorAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('item__name', 'item__price', 'size', 'color', 'in_stock')


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    class TypeInline(admin.TabularInline):
        model = models.Type

    inlines = [TypeInline]

    def save_model(self, request, obj, form, change):
        if compress_pics_on_server():
            if obj.category_image:
                obj.category_image = store_logic.compress_image(obj.category_image)
        super().save_model(request, obj, form, change)


@admin.register(models.Collection)
class CollectionAdmin(DragAndDropRelatedImageMixin, admin.ModelAdmin):
    form = forms.CollectionForm
    related_manager_field_name = 'collection_carousel_images'

    class CarouselImageInline(admin.TabularInline):
        model = models.CollectionCarouselImage

    inlines = [CarouselImageInline]
    list_display = ('name', )

    def save_model(self, request, obj, form, change):
        if compress_pics_on_server():
            if obj.collection_image:
                obj.collection_image = store_logic.compress_image(obj.collection_image)
        super().save_model(request, obj, form, change)


@admin.register(models.Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('usrid', 'stock__item__name', 'stock__item__price', 'stock__size', 'stock__color')

    def usrid(self, obj: models.Wishlist) -> str:
        if obj.user:
            return obj.user.email
        elif obj.session:
            return obj.session.session_key



auth_admin.UserAdmin.raw_id_fields = ["groups"]
