from django.contrib import admin
from django.contrib.auth import admin as auth_admin

from . import models


# Register your models here.

@admin.register(models.Item)
class ItemAdmin(admin.ModelAdmin):
    class StockInLine(admin.TabularInline):
        model = models.Stock

    inlines = [StockInLine]


@admin.register(models.StockImage)
class StockImageAdmin(admin.ModelAdmin):
    pass


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
    class StockImageInline(admin.TabularInline):
        model = models.StockImage

    inlines = [StockImageInline]


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    class TypeInline(admin.TabularInline):
        model = models.Type

    inlines = [TypeInline]


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    pass


auth_admin.UserAdmin.raw_id_fields = ["groups"]
