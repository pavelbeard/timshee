from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from .models import Item, Category, Collection, SizeColor, Type, Logo, RoundImage, ItemSizeColor, Color, Size


# Register your models here.

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    class RoundImagesInline(admin.TabularInline):
        model = RoundImage

    class SizesInLine(admin.TabularInline):
        model = ItemSizeColor

    inlines = [RoundImagesInline, SizesInLine]


@admin.register(RoundImage)
class RoundImageAdmin(admin.ModelAdmin):
    pass


@admin.register(Logo)
class LogoAdmin(admin.ModelAdmin):
    pass


@admin.register(Type)
class TypeAdmin(admin.ModelAdmin):
    pass


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    pass


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    pass


@admin.register(SizeColor)
class SizeColorAdmin(admin.ModelAdmin):
    pass


@admin.register(ItemSizeColor)
class ItemSizeColorAdmin(admin.ModelAdmin):
    pass


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    class TypeInline(admin.TabularInline):
        model = Type

    inlines = [TypeInline]


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    pass


auth_admin.UserAdmin.raw_id_fields = ["groups"]
