from django.contrib import admin
from django.urls import path

from . import models, views


# Register your models here.


@admin.register(models.UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    pass


@admin.register(models.DynamicSettings)
class ConfigAdmin(admin.ModelAdmin):
    pass
