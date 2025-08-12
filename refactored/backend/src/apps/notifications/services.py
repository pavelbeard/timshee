"""
Service classes for notification management.
"""

from typing import Dict, List, Optional, Union
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import transaction

from .models import (
    NotificationTemplate,
    Notification,
    EmailNotification,
    SMSNotification,
    PushNotification,
    UserNotificationPreferences
)


class NotificationService:
    """Service for managing notifications."""

    @staticmethod
    def create_notification_from_template(
        user: User,
        template_name: str,
        context_data: Dict = None,
        scheduled_for: Optional[timezone.datetime] = None
    ) -> Notification:
        """
        Create a notification from a template.
        
        Args:
            user: The user to send the notification to
            template_name: Name of the notification template
            context_data: Context data for template rendering
            scheduled_for: When to send the notification (optional)
        
        Returns:
            Created Notification instance
        
        Raises:
            NotificationTemplate.DoesNotExist: If template doesn't exist
        """
        template = NotificationTemplate.objects.get(
            name=template_name,
            is_active=True
        )
        
        context_data = context_data or {}
        
        # Render template content
        rendered_subject = template.render_subject(context_data)
        rendered_content = template.render_content(context_data)
        
        # Create notification
        notification = Notification.objects.create(
            user=user,
            template=template,
            subject=rendered_subject,
            content=rendered_content,
            notification_type=template.notification_type,
            context_data=context_data,
            scheduled_for=scheduled_for
        )
        
        return notification

    @staticmethod
    def create_notification(
        user: User,
        subject: str,
        content: str,
        notification_type: str,
        context_data: Dict = None,
        scheduled_for: Optional[timezone.datetime] = None
    ) -> Notification:
        """
        Create a notification without using a template.
        
        Args:
            user: The user to send the notification to
            subject: Notification subject
            content: Notification content
            notification_type: Type of notification (email, sms, push, in_app)
            context_data: Additional context data
            scheduled_for: When to send the notification (optional)
        
        Returns:
            Created Notification instance
        """
        return Notification.objects.create(
            user=user,
            subject=subject,
            content=content,
            notification_type=notification_type,
            context_data=context_data or {},
            scheduled_for=scheduled_for
        )

    @staticmethod
    def bulk_create_notifications(
        users: List[User],
        template_name: str,
        context_data: Dict = None,
        scheduled_for: Optional[timezone.datetime] = None
    ) -> List[Notification]:
        """
        Create notifications for multiple users from a template.
        
        Args:
            users: List of users to send notifications to
            template_name: Name of the notification template
            context_data: Context data for template rendering
            scheduled_for: When to send the notifications (optional)
        
        Returns:
            List of created Notification instances
        """
        template = NotificationTemplate.objects.get(
            name=template_name,
            is_active=True
        )
        
        context_data = context_data or {}
        rendered_subject = template.render_subject(context_data)
        rendered_content = template.render_content(context_data)
        
        notifications = []
        for user in users:
            # Check user preferences
            if NotificationService.can_send_notification(user, template.notification_type):
                notification = Notification(
                    user=user,
                    template=template,
                    subject=rendered_subject,
                    content=rendered_content,
                    notification_type=template.notification_type,
                    context_data=context_data,
                    scheduled_for=scheduled_for
                )
                notifications.append(notification)
        
        return Notification.objects.bulk_create(notifications)

    @staticmethod
    def can_send_notification(user: User, notification_type: str, category: str = None) -> bool:
        """
        Check if a notification can be sent to a user based on their preferences.
        
        Args:
            user: The user to check
            notification_type: Type of notification (email, sms, push, in_app)
            category: Category of notification (order_updates, promotions, security)
        
        Returns:
            True if notification can be sent, False otherwise
        """
        try:
            preferences = user.notification_preferences
            return preferences.can_receive_notification(notification_type, category)
        except UserNotificationPreferences.DoesNotExist:
            # If no preferences exist, create default ones and allow notification
            UserNotificationPreferences.objects.create(user=user)
            return True

    @staticmethod
    def mark_notifications_as_read(
        user: User,
        notification_ids: List[int] = None
    ) -> int:
        """
        Mark notifications as read for a user.
        
        Args:
            user: The user whose notifications to mark as read
            notification_ids: Specific notification IDs to mark as read.
                            If None, marks all unread notifications as read.
        
        Returns:
            Number of notifications marked as read
        """
        queryset = Notification.objects.filter(user=user, is_read=False)
        
        if notification_ids:
            queryset = queryset.filter(id__in=notification_ids)
        
        notifications = list(queryset)
        read_at = timezone.now()
        
        for notification in notifications:
            notification.is_read = True
            notification.read_at = read_at
        
        Notification.objects.bulk_update(
            notifications,
            ['is_read', 'read_at']
        )
        
        return len(notifications)

    @staticmethod
    def get_unread_count(user: User) -> int:
        """
        Get the count of unread notifications for a user.
        
        Args:
            user: The user to get unread count for
        
        Returns:
            Number of unread notifications
        """
        return Notification.objects.filter(
            user=user,
            is_read=False
        ).count()

    @staticmethod
    def get_user_notifications(
        user: User,
        limit: int = 20,
        offset: int = 0,
        notification_type: str = None,
        unread_only: bool = False
    ):
        """
        Get notifications for a user with pagination and filtering.
        
        Args:
            user: The user to get notifications for
            limit: Maximum number of notifications to return
            offset: Number of notifications to skip
            notification_type: Filter by notification type
            unread_only: If True, only return unread notifications
        
        Returns:
            QuerySet of notifications
        """
        queryset = Notification.objects.filter(user=user)
        
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        return queryset.order_by('-created_at')[offset:offset + limit]


class EmailNotificationService:
    """Service for managing email notifications."""

    @staticmethod
    def create_email_notification(
        notification: Notification,
        to_email: str,
        from_email: str,
        cc_emails: List[str] = None,
        bcc_emails: List[str] = None,
        html_content: str = None,
        attachments: List[str] = None
    ) -> EmailNotification:
        """
        Create an email notification with extended details.
        
        Args:
            notification: The base notification
            to_email: Recipient email address
            from_email: Sender email address
            cc_emails: List of CC email addresses
            bcc_emails: List of BCC email addresses
            html_content: HTML version of the email content
            attachments: List of attachment file paths or URLs
        
        Returns:
            Created EmailNotification instance
        """
        return EmailNotification.objects.create(
            notification=notification,
            to_email=to_email,
            from_email=from_email,
            cc_emails=cc_emails or [],
            bcc_emails=bcc_emails or [],
            html_content=html_content or '',
            attachments=attachments or []
        )

    @staticmethod
    def mark_as_delivered(email_notification: EmailNotification, provider_id: str = None):
        """Mark an email notification as delivered."""
        email_notification.delivered_at = timezone.now()
        if provider_id:
            email_notification.email_provider_id = provider_id
        email_notification.save(update_fields=['delivered_at', 'email_provider_id'])
        email_notification.notification.mark_as_delivered()

    @staticmethod
    def mark_as_bounced(email_notification: EmailNotification, bounce_reason: str):
        """Mark an email notification as bounced/failed."""
        email_notification.bounce_reason = bounce_reason
        email_notification.save(update_fields=['bounce_reason'])
        email_notification.notification.mark_as_failed()


class UserPreferencesService:
    """Service for managing user notification preferences."""

    @staticmethod
    def get_or_create_preferences(user: User) -> UserNotificationPreferences:
        """
        Get or create notification preferences for a user.
        
        Args:
            user: The user to get preferences for
        
        Returns:
            UserNotificationPreferences instance
        """
        preferences, created = UserNotificationPreferences.objects.get_or_create(
            user=user
        )
        return preferences

    @staticmethod
    def update_preferences(
        user: User,
        **preferences_data
    ) -> UserNotificationPreferences:
        """
        Update notification preferences for a user.
        
        Args:
            user: The user to update preferences for
            **preferences_data: Preference fields to update
        
        Returns:
            Updated UserNotificationPreferences instance
        """
        preferences = UserPreferencesService.get_or_create_preferences(user)
        
        for field, value in preferences_data.items():
            if hasattr(preferences, field):
                setattr(preferences, field, value)
        
        preferences.save()
        return preferences

    @staticmethod
    def disable_all_notifications(user: User) -> UserNotificationPreferences:
        """
        Disable all notifications for a user.
        
        Args:
            user: The user to disable notifications for
        
        Returns:
            Updated UserNotificationPreferences instance
        """
        return UserPreferencesService.update_preferences(
            user,
            email_enabled=False,
            sms_enabled=False,
            push_enabled=False,
            in_app_enabled=False
        )

    @staticmethod
    def enable_essential_only(user: User) -> UserNotificationPreferences:
        """
        Enable only essential notifications (security) for a user.
        
        Args:
            user: The user to update preferences for
        
        Returns:
            Updated UserNotificationPreferences instance
        """
        return UserPreferencesService.update_preferences(
            user,
            email_enabled=True,
            email_order_updates=True,
            email_promotions=False,
            email_security=True,
            sms_enabled=False,
            sms_order_updates=False,
            sms_security=True,
            push_enabled=True,
            push_order_updates=True,
            push_promotions=False,
            in_app_enabled=True
        )
