from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from dragndrop_related.views import DragAndDropRelatedImageMixin

from . import models, forms, store_logic
from stuff import models as stuff_models


# Register your models here.

def get_experimental_feature() -> bool:
    dynamic_settings: stuff_models.DynamicSettings = stuff_models.DynamicSettings.objects.first()
    if not dynamic_settings:
        return True
    return dynamic_settings.experimental


@admin.register(models.Item)
class ItemAdmin(DragAndDropRelatedImageMixin, admin.ModelAdmin):
    related_manager_field_name = 'carousel_images'

    class StockInLine(admin.TabularInline):
        model = models.Stock
        form = forms.StockForm

    class CarouselImageInline(admin.TabularInline):
        model = models.CarouselImage
        form = forms.CarouselImageForm

    inlines = [StockInLine, CarouselImageInline]

    def save_model(self, request, obj, form, change):
        if not get_experimental_feature():
            if obj.image:
                obj.image = store_logic.compress_image(obj.image)
        super().save_model(request, obj, form, change)


@admin.register(models.CarouselImage)
class StockImageAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if not get_experimental_feature():
            if obj.image:
                obj.image = store_logic.compress_image(obj.image)
        super().save_model(request, obj, form, change)


@admin.register(models.Type)
class TypeAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Size)
class SizeAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Color)
class ColorAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Stock)
class StockAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    class TypeInline(admin.TabularInline):
        model = models.Type

    inlines = [TypeInline]

    def save_model(self, request, obj, form, change):
        if not get_experimental_feature():
            if obj.category_image:
                obj.category_image = store_logic.compress_image(obj.category_image)
        super().save_model(request, obj, form, change)


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    form = forms.CollectionForm

    def save_model(self, request, obj, form, change):
        if not get_experimental_feature():
            if obj.collection_image:
                obj.collection_image = store_logic.compress_image(obj.collection_image)
        super().save_model(request, obj, form, change)


@admin.register(models.Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    pass


auth_admin.UserAdmin.raw_id_fields = ["groups"]
