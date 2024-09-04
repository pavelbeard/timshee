from django.contrib import admin

from . import models


# Register your models here.


@admin.register(models.UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_confirmed', 'preferred_language')


@admin.register(models.DynamicSettings)
class ConfigAdmin(admin.ModelAdmin):
    list_display = ('id', 'on_maintenance', 'on_content_update', 'compress_pics_on_server', 'experimental', 'international')


@admin.register(models.OwnerData)
class OwnerDataAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'tax_number', 'contact_number')