"""
Authentication admin configuration.
"""

from django.contrib import admin
from .models import UserProfile, EmailToken, DynamicSettings, OwnerData


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_confirmed', 'preferred_language', 'created_at')
    list_filter = ('email_confirmed', 'preferred_language')
    search_fields = ('user__username', 'user__email')


@admin.register(EmailToken)
class EmailTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token_type', 'is_used', 'expires_at', 'created_at')
    list_filter = ('token_type', 'is_used')
    search_fields = ('user__username', 'user__email')


@admin.register(DynamicSettings)
class DynamicSettingsAdmin(admin.ModelAdmin):
    list_display = (
        'id', 
        'on_maintenance', 
        'on_content_update', 
        'compress_pics_on_server', 
        'experimental', 
        'international'
    )


@admin.register(OwnerData)
class OwnerDataAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'tax_number', 'contact_number')
