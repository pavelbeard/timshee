from django.contrib import admin

from . import models


# Register your models here.

@admin.register(models.Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'store_order_number', 'status', 'created_at')
