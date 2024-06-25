import sys
from io import BytesIO

from PIL import Image
from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.core.files.uploadedfile import InMemoryUploadedFile

from . import models


# Register your models here.


def compress_image(image):
    tmp = Image.open(image)
    output_to_stream = BytesIO()
    image_temp = tmp.convert('RGB')
    image_temp.save(output_to_stream, format='JPEG', quality=85)
    output_to_stream.seek(0)
    file = InMemoryUploadedFile(
        output_to_stream, 'ImageField',
        f'{image.name.split(".")[0]}.jpg',
        'image/jpeg',
        sys.getsizeof(output_to_stream),
        None
    )
    return file


@admin.register(models.Item)
class ItemAdmin(admin.ModelAdmin):
    class StockInLine(admin.TabularInline):
        model = models.Stock

    class CarouselImageInline(admin.TabularInline):
        model = models.CarouselImage

    inlines = [StockInLine, CarouselImageInline]
    
    def save_model(self, request, obj, form, change):
        if obj.image:
            obj.image = compress_image(obj.image)
        super().save_model(request, obj, form, change)


@admin.register(models.CarouselImage)
class StockImageAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if obj.image:
            obj.image = compress_image(obj.image)
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
        if obj.category_image:
            obj.category_image = compress_image(obj.category_image)
        super().save_model(request, obj, form, change)


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        if obj.collection_image:
            obj.collection_image = compress_image(obj.collection_image)
        super().save_model(request, obj, form, change)


@admin.register(models.Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    pass


auth_admin.UserAdmin.raw_id_fields = ["groups"]
