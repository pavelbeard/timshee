from django.contrib import admin

from . import models


# Register your models here.

@admin.register(models.Payment)
class PaymentAdmin(admin.ModelAdmin):
    pass
