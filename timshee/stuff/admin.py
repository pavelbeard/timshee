from django.contrib import admin

from . import models


# Register your models here.


@admin.register(models.UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(models.DynamicSettings)
class ConfigAdmin(admin.ModelAdmin):
    pass


@admin.register(models.OwnerData)
class OwnerDataAdmin(admin.ModelAdmin):
    pass