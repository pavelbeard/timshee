"""
Serializers for the notifications application.
"""

from rest_framework import serializers
from django.contrib.auth.models import User

from .models import (
    NotificationTemplate,
    Notification,
    EmailNotification,
    SMSNotification,
    PushNotification,
    UserNotificationPreferences
)


class NotificationTemplateSerializer(serializers.ModelSerializer):
    """Serializer for NotificationTemplate model."""
    
    notification_type_display = serializers.CharField(
        source='get_notification_type_display', 
        read_only=True
    )

    class Meta:
        model = NotificationTemplate
        fields = [
            'id',
            'name',
            'subject',
            'content',
            'notification_type',
            'notification_type_display',
            'is_active',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model."""
    
    user = serializers.StringRelatedField(read_only=True)
    template = NotificationTemplateSerializer(read_only=True)
    status_display = serializers.CharField(
        source='get_status_display', 
        read_only=True
    )
    notification_type_display = serializers.CharField(
        source='get_notification_type_display', 
        read_only=True
    )

    class Meta:
        model = Notification
        fields = [
            'id',
            'user',
            'template',
            'subject',
            'content',
            'notification_type',
            'notification_type_display',
            'status',
            'status_display',
            'context_data',
            'is_read',
            'read_at',
            'scheduled_for',
            'sent_at',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'user',
            'template',
            'read_at',
            'sent_at',
            'created_at',
            'updated_at'
        ]


class NotificationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing notifications."""
    
    status_display = serializers.CharField(
        source='get_status_display', 
        read_only=True
    )
    notification_type_display = serializers.CharField(
        source='get_notification_type_display', 
        read_only=True
    )

    class Meta:
        model = Notification
        fields = [
            'id',
            'subject',
            'notification_type',
            'notification_type_display',
            'status',
            'status_display',
            'is_read',
            'created_at'
        ]


class EmailNotificationSerializer(serializers.ModelSerializer):
    """Serializer for EmailNotification model."""
    
    notification = NotificationSerializer(read_only=True)

    class Meta:
        model = EmailNotification
        fields = [
            'id',
            'notification',
            'to_email',
            'from_email',
            'cc_emails',
            'bcc_emails',
            'html_content',
            'attachments',
            'delivery_attempts',
            'last_delivery_attempt',
            'delivered_at',
            'bounce_reason',
            'email_provider_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'delivery_attempts',
            'last_delivery_attempt',
            'delivered_at',
            'created_at',
            'updated_at'
        ]


class SMSNotificationSerializer(serializers.ModelSerializer):
    """Serializer for SMSNotification model."""
    
    notification = NotificationSerializer(read_only=True)

    class Meta:
        model = SMSNotification
        fields = [
            'id',
            'notification',
            'to_phone',
            'from_phone',
            'delivery_attempts',
            'last_delivery_attempt',
            'delivered_at',
            'sms_provider_id',
            'cost',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'delivery_attempts',
            'last_delivery_attempt',
            'delivered_at',
            'created_at',
            'updated_at'
        ]


class PushNotificationSerializer(serializers.ModelSerializer):
    """Serializer for PushNotification model."""
    
    notification = NotificationSerializer(read_only=True)
    platform_display = serializers.CharField(
        source='get_platform_display', 
        read_only=True
    )

    class Meta:
        model = PushNotification
        fields = [
            'id',
            'notification',
            'device_token',
            'platform',
            'platform_display',
            'badge_count',
            'sound',
            'category',
            'action_url',
            'custom_data',
            'delivery_attempts',
            'last_delivery_attempt',
            'delivered_at',
            'push_provider_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'delivery_attempts',
            'last_delivery_attempt',
            'delivered_at',
            'created_at',
            'updated_at'
        ]


class UserNotificationPreferencesSerializer(serializers.ModelSerializer):
    """Serializer for UserNotificationPreferences model."""
    
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = UserNotificationPreferences
        fields = [
            'id',
            'user',
            'email_enabled',
            'email_order_updates',
            'email_promotions',
            'email_security',
            'sms_enabled',
            'sms_order_updates',
            'sms_security',
            'push_enabled',
            'push_order_updates',
            'push_promotions',
            'in_app_enabled',
            'quiet_hours_enabled',
            'quiet_hours_start',
            'quiet_hours_end',
            'timezone',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate_quiet_hours(self, attrs):
        """Validate quiet hours configuration."""
        quiet_hours_enabled = attrs.get('quiet_hours_enabled')
        quiet_hours_start = attrs.get('quiet_hours_start')
        quiet_hours_end = attrs.get('quiet_hours_end')
        
        if quiet_hours_enabled:
            if not quiet_hours_start or not quiet_hours_end:
                raise serializers.ValidationError(
                    "Both quiet_hours_start and quiet_hours_end must be set when quiet hours are enabled."
                )
        
        return attrs

    def validate(self, attrs):
        attrs = self.validate_quiet_hours(attrs)
        return super().validate(attrs)


class CreateNotificationSerializer(serializers.Serializer):
    """Serializer for creating notifications."""
    
    user_id = serializers.IntegerField()
    template_id = serializers.IntegerField(required=False)
    subject = serializers.CharField(max_length=255)
    content = serializers.CharField()
    notification_type = serializers.ChoiceField(
        choices=Notification.NOTIFICATION_TYPE_CHOICES
    )
    context_data = serializers.JSONField(default=dict, required=False)
    scheduled_for = serializers.DateTimeField(required=False)

    def validate_user_id(self, value):
        """Validate that the user exists."""
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        return value

    def validate_template_id(self, value):
        """Validate that the template exists and is active."""
        if value:
            try:
                template = NotificationTemplate.objects.get(id=value)
                if not template.is_active:
                    raise serializers.ValidationError("Template is not active.")
            except NotificationTemplate.DoesNotExist:
                raise serializers.ValidationError("Template does not exist.")
        return value

    def create(self, validated_data):
        """Create a new notification."""
        user = User.objects.get(id=validated_data['user_id'])
        template = None
        
        if validated_data.get('template_id'):
            template = NotificationTemplate.objects.get(
                id=validated_data['template_id']
            )
        
        notification = Notification.objects.create(
            user=user,
            template=template,
            subject=validated_data['subject'],
            content=validated_data['content'],
            notification_type=validated_data['notification_type'],
            context_data=validated_data.get('context_data', {}),
            scheduled_for=validated_data.get('scheduled_for')
        )
        
        return notification


class MarkAsReadSerializer(serializers.Serializer):
    """Serializer for marking notifications as read."""
    
    notification_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        help_text="List of notification IDs to mark as read. If not provided, all notifications will be marked as read."
    )

    def validate_notification_ids(self, value):
        """Validate that all notification IDs exist and belong to the user."""
        if value:
            user = self.context['request'].user
            existing_ids = list(
                Notification.objects.filter(
                    id__in=value,
                    user=user
                ).values_list('id', flat=True)
            )
            
            if len(existing_ids) != len(value):
                missing_ids = set(value) - set(existing_ids)
                raise serializers.ValidationError(
                    f"The following notification IDs do not exist or don't belong to you: {missing_ids}"
                )
        
        return value
