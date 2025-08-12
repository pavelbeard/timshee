"""
Django admin configuration for notifications app.
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _

from .models import (
    NotificationTemplate,
    Notification,
    EmailNotification,
    SMSNotification,
    PushNotification,
    UserNotificationPreferences
)


@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'notification_type', 'is_active', 'created_at']
    list_filter = ['notification_type', 'is_active', 'created_at']
    search_fields = ['name', 'subject', 'content']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        (None, {
            'fields': ('name', 'notification_type', 'is_active')
        }),
        (_('Content'), {
            'fields': ('subject', 'content'),
            'description': _('Template content supports Django template syntax for dynamic content.')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class EmailNotificationInline(admin.StackedInline):
    model = EmailNotification
    extra = 0
    readonly_fields = ['delivery_attempts', 'last_delivery_attempt', 'delivered_at']


class SMSNotificationInline(admin.StackedInline):
    model = SMSNotification
    extra = 0
    readonly_fields = ['delivery_attempts', 'last_delivery_attempt', 'delivered_at']


class PushNotificationInline(admin.StackedInline):
    model = PushNotification
    extra = 0
    readonly_fields = ['delivery_attempts', 'last_delivery_attempt', 'delivered_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'subject', 
        'user', 
        'notification_type', 
        'status', 
        'is_read', 
        'created_at',
        'sent_at'
    ]
    list_filter = [
        'notification_type', 
        'status', 
        'is_read', 
        'created_at',
        'template'
    ]
    search_fields = ['subject', 'content', 'user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at', 'read_at', 'sent_at']
    raw_id_fields = ['user', 'template']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {
            'fields': ('user', 'template', 'notification_type', 'status')
        }),
        (_('Content'), {
            'fields': ('subject', 'content')
        }),
        (_('Status'), {
            'fields': ('is_read', 'read_at', 'sent_at', 'scheduled_for')
        }),
        (_('Context Data'), {
            'fields': ('context_data',),
            'classes': ('collapse',)
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [EmailNotificationInline, SMSNotificationInline, PushNotificationInline]
    
    actions = ['mark_as_read', 'mark_as_sent']
    
    def mark_as_read(self, request, queryset):
        """Mark selected notifications as read."""
        updated = 0
        for notification in queryset.filter(is_read=False):
            notification.mark_as_read()
            updated += 1
        self.message_user(request, f'{updated} notifications marked as read.')
    mark_as_read.short_description = _('Mark selected notifications as read')
    
    def mark_as_sent(self, request, queryset):
        """Mark selected notifications as sent."""
        updated = queryset.filter(status='pending').update(status='sent')
        self.message_user(request, f'{updated} notifications marked as sent.')
    mark_as_sent.short_description = _('Mark selected notifications as sent')


@admin.register(EmailNotification)
class EmailNotificationAdmin(admin.ModelAdmin):
    list_display = [
        'notification_subject',
        'to_email',
        'from_email',
        'delivery_attempts',
        'delivered_at',
        'created_at'
    ]
    list_filter = ['delivery_attempts', 'delivered_at', 'created_at']
    search_fields = [
        'to_email', 
        'from_email', 
        'notification__subject',
        'notification__user__username'
    ]
    readonly_fields = [
        'created_at', 
        'updated_at', 
        'delivery_attempts',
        'last_delivery_attempt',
        'delivered_at'
    ]
    raw_id_fields = ['notification']
    
    def notification_subject(self, obj):
        return obj.notification.subject
    notification_subject.short_description = _('Subject')


@admin.register(SMSNotification)
class SMSNotificationAdmin(admin.ModelAdmin):
    list_display = [
        'notification_subject',
        'to_phone',
        'delivery_attempts',
        'delivered_at',
        'cost',
        'created_at'
    ]
    list_filter = ['delivery_attempts', 'delivered_at', 'created_at']
    search_fields = [
        'to_phone',
        'from_phone',
        'notification__subject',
        'notification__user__username'
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
        'delivery_attempts',
        'last_delivery_attempt',
        'delivered_at'
    ]
    raw_id_fields = ['notification']
    
    def notification_subject(self, obj):
        return obj.notification.subject
    notification_subject.short_description = _('Subject')


@admin.register(PushNotification)
class PushNotificationAdmin(admin.ModelAdmin):
    list_display = [
        'notification_subject',
        'device_token_short',
        'platform',
        'delivery_attempts',
        'delivered_at',
        'created_at'
    ]
    list_filter = ['platform', 'delivery_attempts', 'delivered_at', 'created_at']
    search_fields = [
        'device_token',
        'notification__subject',
        'notification__user__username'
    ]
    readonly_fields = [
        'created_at',
        'updated_at',
        'delivery_attempts',
        'last_delivery_attempt',
        'delivered_at'
    ]
    raw_id_fields = ['notification']
    
    def notification_subject(self, obj):
        return obj.notification.subject
    notification_subject.short_description = _('Subject')
    
    def device_token_short(self, obj):
        return f"{obj.device_token[:20]}..." if len(obj.device_token) > 20 else obj.device_token
    device_token_short.short_description = _('Device Token')


@admin.register(UserNotificationPreferences)
class UserNotificationPreferencesAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'email_enabled',
        'sms_enabled',
        'push_enabled',
        'in_app_enabled',
        'quiet_hours_enabled'
    ]
    list_filter = [
        'email_enabled',
        'sms_enabled',
        'push_enabled',
        'in_app_enabled',
        'quiet_hours_enabled'
    ]
    search_fields = ['user__username', 'user__email']
    raw_id_fields = ['user']
    
    fieldsets = (
        (None, {
            'fields': ('user',)
        }),
        (_('Email Preferences'), {
            'fields': (
                'email_enabled',
                'email_order_updates',
                'email_promotions',
                'email_security'
            )
        }),
        (_('SMS Preferences'), {
            'fields': (
                'sms_enabled',
                'sms_order_updates',
                'sms_security'
            )
        }),
        (_('Push Notification Preferences'), {
            'fields': (
                'push_enabled',
                'push_order_updates',
                'push_promotions'
            )
        }),
        (_('In-App Preferences'), {
            'fields': ('in_app_enabled',)
        }),
        (_('Quiet Hours'), {
            'fields': (
                'quiet_hours_enabled',
                'quiet_hours_start',
                'quiet_hours_end',
                'timezone'
            ),
            'description': _('Configure quiet hours to prevent notifications during specific times.')
        }),
        (_('Timestamps'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']
