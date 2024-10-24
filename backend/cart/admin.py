# Register your models here.
import math
from decimal import Decimal

from django.contrib import admin
from django.db.models import Sum, F, DecimalField

from . import models

@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('usrid', 'get_total_items', 'get_total_price')

    def usrid(self, obj: models.Cart) -> str:
        if obj.user:
            return obj.user.email
        elif obj.session:
            return obj.session.session_key

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(
            total_items=Sum('cartitem__quantity'),
            total_price=Sum(F('cartitem__quantity') * F('cartitem__stock_item__item__price'), output_field=DecimalField())
        )

    def get_total_items(self, obj: models.Cart) -> int:
        return obj.total_items or 0

    def get_total_price(self, obj: models.Cart) -> Decimal | int:
        if obj.total_price:
            return math.floor(obj.total_price * 100) / 100
        return 0

    get_total_items.admin_order_field = 'total_items'  # Поле для сортировки
    get_total_price.admin_order_field = 'total_price'  # Поле для сортировки


    class CartItemInline(admin.TabularInline):
        model = models.CartItem

    inlines = [CartItemInline]


@admin.register(models.CartItem)
class CartItemAdmin(admin.ModelAdmin):
    pass