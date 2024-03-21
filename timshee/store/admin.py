from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from .models import Item, Category, Collection


# Register your models here.

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    pass


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    pass

auth_admin.UserAdmin.raw_id_fields = ["groups"]
# auth_admin.UserAdmin.fields = ["groups"]
