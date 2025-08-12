"""
Django admin configuration for payments app.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse

from .models import (
    PaymentMethod,
    Payment,
    PaymentRefund,
    PaymentWebhook,
    PaymentIntent
)


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    """Admin configuration for PaymentMethod."""
    
    list_display = [
        'user_email',
        'name',
        'payment_type',
        'provider',
        'card_display',
        'is_default',
        'is_active',
        'created_at'
    ]
    
    list_filter = [
        'payment_type',
        'provider',
        'is_default',
        'is_active',
        'created_at',
        'card_brand'
    ]
    
    search_fields = [
        'user__email',
        'user__username',
        'name',
        'provider_method_id',
        'card_last_four'
    ]
    
    readonly_fields = [
        'created_at',
        'updated_at',
        'provider_method_id',
        'metadata'
    ]
    
    fieldsets = [
        ('Basic Information', {
            'fields': [
                'user',
                'name',
                'payment_type',
                'provider',
                'provider_method_id',
                'is_default',
                'is_active'
            ]
        }),
        ('Card Information', {
            'fields': [
                'card_last_four',
                'card_brand',
                'card_exp_month',
                'card_exp_year'
            ],
            'classes': ['collapse']
        }),
        ('Metadata', {
            'fields': [
                'metadata',
                'created_at',
                'updated_at'
            ],
            'classes': ['collapse']
        })
    ]
    
    def user_email(self, obj):
        """Display user email."""
        return obj.user.email
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def card_display(self, obj):
        """Display card information."""
        if obj.card_last_four and obj.card_brand:
            return f"{obj.card_brand.title()} •••• {obj.card_last_four}"
        return "-"
    card_display.short_description = 'Card'
    
    def get_queryset(self, request):
        """Optimize queryset."""
        return super().get_queryset(request).select_related('user')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin configuration for Payment."""
    
    list_display = [
        'payment_id_short',
        'user_email',
        'amount_display',
        'status_display',
        'gateway',
        'payment_method_display',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'gateway',
        'currency',
        'created_at',
        'captured_at',
        'failed_at'
    ]
    
    search_fields = [
        'payment_id',
        'user__email',
        'user__username',
        'gateway_transaction_id',
        'reference_id',
        'description'
    ]
    
    readonly_fields = [
        'payment_id',
        'created_at',
        'updated_at',
        'authorized_at',
        'captured_at',
        'failed_at',
        'gateway_transaction_id',
        'gateway_response',
        'net_amount'
    ]
    
    fieldsets = [
        ('Payment Information', {
            'fields': [
                'payment_id',
                'user',
                'payment_method',
                'amount',
                'currency',
                'status',
                'description',
                'reference_id'
            ]
        }),
        ('Gateway Information', {
            'fields': [
                'gateway',
                'gateway_transaction_id',
                'gateway_response'
            ],
            'classes': ['collapse']
        }),
        ('Financial Details', {
            'fields': [
                'fee_amount',
                'net_amount'
            ]
        }),
        ('Timestamps', {
            'fields': [
                'created_at',
                'updated_at',
                'authorized_at',
                'captured_at',
                'failed_at'
            ],
            'classes': ['collapse']
        }),
        ('Failure Information', {
            'fields': [
                'failure_reason',
                'failure_code'
            ],
            'classes': ['collapse']
        }),
        ('Metadata', {
            'fields': ['metadata'],
            'classes': ['collapse']
        })
    ]
    
    def payment_id_short(self, obj):
        """Display shortened payment ID."""
        return str(obj.payment_id)[:8] + "..."
    payment_id_short.short_description = 'Payment ID'
    payment_id_short.admin_order_field = 'payment_id'
    
    def user_email(self, obj):
        """Display user email."""
        return obj.user.email
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def amount_display(self, obj):
        """Display amount with currency."""
        return f"{obj.amount} {obj.currency}"
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'
    
    def status_display(self, obj):
        """Display status with color coding."""
        colors = {
            'completed': 'green',
            'pending': 'orange',
            'processing': 'blue',
            'failed': 'red',
            'cancelled': 'gray',
            'refunded': 'purple',
            'partially_refunded': 'orange'
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'
    status_display.admin_order_field = 'status'
    
    def payment_method_display(self, obj):
        """Display payment method information."""
        if obj.payment_method:
            return str(obj.payment_method)
        return "-"
    payment_method_display.short_description = 'Payment Method'
    
    def get_queryset(self, request):
        """Optimize queryset."""
        return super().get_queryset(request).select_related(
            'user', 'payment_method'
        )


class PaymentRefundInline(admin.TabularInline):
    """Inline admin for payment refunds."""
    model = PaymentRefund
    extra = 0
    readonly_fields = [
        'refund_id',
        'gateway_refund_id',
        'processed_at',
        'failed_at',
        'created_at'
    ]
    fields = [
        'refund_id',
        'amount',
        'currency',
        'status',
        'reason',
        'gateway_refund_id',
        'processed_at',
        'failed_at'
    ]


@admin.register(PaymentRefund)
class PaymentRefundAdmin(admin.ModelAdmin):
    """Admin configuration for PaymentRefund."""
    
    list_display = [
        'refund_id_short',
        'payment_link',
        'amount_display',
        'status_display',
        'reason_short',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'currency',
        'created_at',
        'processed_at',
        'failed_at'
    ]
    
    search_fields = [
        'refund_id',
        'payment__payment_id',
        'payment__user__email',
        'gateway_refund_id',
        'reason'
    ]
    
    readonly_fields = [
        'refund_id',
        'created_at',
        'updated_at',
        'processed_at',
        'failed_at',
        'gateway_refund_id',
        'gateway_response'
    ]
    
    fieldsets = [
        ('Refund Information', {
            'fields': [
                'refund_id',
                'payment',
                'amount',
                'currency',
                'status',
                'reason'
            ]
        }),
        ('Gateway Information', {
            'fields': [
                'gateway_refund_id',
                'gateway_response'
            ],
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': [
                'created_at',
                'updated_at',
                'processed_at',
                'failed_at'
            ],
            'classes': ['collapse']
        }),
        ('Failure Information', {
            'fields': ['failure_reason'],
            'classes': ['collapse']
        }),
        ('Metadata', {
            'fields': ['metadata'],
            'classes': ['collapse']
        })
    ]
    
    def refund_id_short(self, obj):
        """Display shortened refund ID."""
        return str(obj.refund_id)[:8] + "..."
    refund_id_short.short_description = 'Refund ID'
    refund_id_short.admin_order_field = 'refund_id'
    
    def payment_link(self, obj):
        """Display link to related payment."""
        url = reverse('admin:payments_payment_change', args=[obj.payment.pk])
        return format_html('<a href="{}">{}</a>', url, str(obj.payment.payment_id)[:8] + "...")
    payment_link.short_description = 'Payment'
    payment_link.admin_order_field = 'payment__payment_id'
    
    def amount_display(self, obj):
        """Display amount with currency."""
        return f"{obj.amount} {obj.currency}"
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'
    
    def status_display(self, obj):
        """Display status with color coding."""
        colors = {
            'completed': 'green',
            'pending': 'orange',
            'processing': 'blue',
            'failed': 'red',
            'cancelled': 'gray'
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'
    status_display.admin_order_field = 'status'
    
    def reason_short(self, obj):
        """Display shortened reason."""
        if obj.reason:
            return obj.reason[:50] + "..." if len(obj.reason) > 50 else obj.reason
        return "-"
    reason_short.short_description = 'Reason'
    
    def get_queryset(self, request):
        """Optimize queryset."""
        return super().get_queryset(request).select_related('payment__user')


@admin.register(PaymentIntent)
class PaymentIntentAdmin(admin.ModelAdmin):
    """Admin configuration for PaymentIntent."""
    
    list_display = [
        'intent_id_short',
        'user_email',
        'amount_display',
        'status_display',
        'gateway',
        'payment_link',
        'created_at'
    ]
    
    list_filter = [
        'status',
        'gateway',
        'currency',
        'capture_method',
        'created_at'
    ]
    
    search_fields = [
        'intent_id',
        'user__email',
        'user__username',
        'gateway_intent_id',
        'reference_id',
        'description'
    ]
    
    readonly_fields = [
        'intent_id',
        'created_at',
        'updated_at',
        'gateway_intent_id',
        'client_secret'
    ]
    
    fieldsets = [
        ('Intent Information', {
            'fields': [
                'intent_id',
                'user',
                'amount',
                'currency',
                'status',
                'description',
                'reference_id',
                'capture_method'
            ]
        }),
        ('Gateway Information', {
            'fields': [
                'gateway',
                'gateway_intent_id',
                'client_secret'
            ],
            'classes': ['collapse']
        }),
        ('Related Objects', {
            'fields': ['payment'],
            'classes': ['collapse']
        }),
        ('Metadata', {
            'fields': ['metadata'],
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': [
                'created_at',
                'updated_at'
            ],
            'classes': ['collapse']
        })
    ]
    
    def intent_id_short(self, obj):
        """Display shortened intent ID."""
        return str(obj.intent_id)[:8] + "..."
    intent_id_short.short_description = 'Intent ID'
    intent_id_short.admin_order_field = 'intent_id'
    
    def user_email(self, obj):
        """Display user email."""
        return obj.user.email
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def amount_display(self, obj):
        """Display amount with currency."""
        return f"{obj.amount} {obj.currency}"
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'
    
    def status_display(self, obj):
        """Display status with color coding."""
        colors = {
            'succeeded': 'green',
            'requires_payment_method': 'orange',
            'requires_confirmation': 'blue',
            'requires_action': 'blue',
            'processing': 'blue',
            'requires_capture': 'orange',
            'cancelled': 'gray'
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'
    status_display.admin_order_field = 'status'
    
    def payment_link(self, obj):
        """Display link to related payment."""
        if obj.payment:
            url = reverse('admin:payments_payment_change', args=[obj.payment.pk])
            return format_html('<a href="{}">{}</a>', url, str(obj.payment.payment_id)[:8] + "...")
        return "-"
    payment_link.short_description = 'Payment'
    
    def get_queryset(self, request):
        """Optimize queryset."""
        return super().get_queryset(request).select_related('user', 'payment')


@admin.register(PaymentWebhook)
class PaymentWebhookAdmin(admin.ModelAdmin):
    """Admin configuration for PaymentWebhook."""
    
    list_display = [
        'webhook_id_short',
        'gateway',
        'event_type',
        'status_display',
        'related_payment_link',
        'created_at'
    ]
    
    list_filter = [
        'gateway',
        'status',
        'event_type',
        'created_at',
        'processed_at'
    ]
    
    search_fields = [
        'webhook_id',
        'gateway_event_id',
        'event_type',
        'related_payment__payment_id'
    ]
    
    readonly_fields = [
        'webhook_id',
        'created_at',
        'updated_at',
        'processed_at',
        'payload',
        'headers',
        'gateway_event_id'
    ]
    
    fieldsets = [
        ('Webhook Information', {
            'fields': [
                'webhook_id',
                'gateway',
                'event_type',
                'gateway_event_id',
                'status',
                'related_payment'
            ]
        }),
        ('Processing Information', {
            'fields': [
                'processed_at',
                'error_message'
            ]
        }),
        ('Webhook Data', {
            'fields': [
                'payload',
                'headers'
            ],
            'classes': ['collapse']
        }),
        ('Timestamps', {
            'fields': [
                'created_at',
                'updated_at'
            ],
            'classes': ['collapse']
        })
    ]
    
    def webhook_id_short(self, obj):
        """Display shortened webhook ID."""
        return str(obj.webhook_id)[:8] + "..."
    webhook_id_short.short_description = 'Webhook ID'
    webhook_id_short.admin_order_field = 'webhook_id'
    
    def status_display(self, obj):
        """Display status with color coding."""
        colors = {
            'processed': 'green',
            'pending': 'orange',
            'failed': 'red',
            'ignored': 'gray'
        }
        color = colors.get(obj.status, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_display.short_description = 'Status'
    status_display.admin_order_field = 'status'
    
    def related_payment_link(self, obj):
        """Display link to related payment."""
        if obj.related_payment:
            url = reverse('admin:payments_payment_change', args=[obj.related_payment.pk])
            return format_html('<a href="{}">{}</a>', url, str(obj.related_payment.payment_id)[:8] + "...")
        return "-"
    related_payment_link.short_description = 'Related Payment'
    
    def get_queryset(self, request):
        """Optimize queryset."""
        return super().get_queryset(request).select_related('related_payment')


# Add refunds inline to Payment admin
PaymentAdmin.inlines = [PaymentRefundInline]
