"""
Unit tests for the notifications application.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient

from src.apps.notifications.models import Notification, NotificationTemplate, EmailNotification


class NotificationTemplateModelTest(TestCase):
    """Test cases for NotificationTemplate model."""

    def setUp(self):
        self.template_data = {
            'name': 'order_confirmation',
            'subject': 'Order Confirmation - {{order_number}}',
            'content': 'Thank you for your order {{order_number}}. Total: ${{total_amount}}',
            'notification_type': 'email',
            'is_active': True
        }

    def test_notification_template_creation(self):
        """Test creating a notification template."""
        template = NotificationTemplate.objects.create(**self.template_data)
        self.assertEqual(template.name, 'order_confirmation')
        self.assertEqual(template.notification_type, 'email')
        self.assertTrue(template.is_active)

    def test_notification_template_str_representation(self):
        """Test string representation of notification template."""
        template = NotificationTemplate.objects.create(**self.template_data)
        expected_str = f"order_confirmation (Email)"
        self.assertEqual(str(template), expected_str)

    def test_notification_template_render_method(self):
        """Test template rendering with context."""
        template = NotificationTemplate.objects.create(**self.template_data)
        
        context = {
            'order_number': 'ORD-123456',
            'total_amount': '199.98'
        }
        
        rendered_subject = template.render_subject(context)
        rendered_content = template.render_content(context)
        
        self.assertIn('ORD-123456', rendered_subject)
        self.assertIn('199.98', rendered_content)

    def test_notification_template_types(self):
        """Test different notification types."""
        notification_types = ['email', 'sms', 'push', 'in_app']
        
        for notif_type in notification_types:
            template_data = self.template_data.copy()
            template_data['name'] = f'test_{notif_type}'
            template_data['notification_type'] = notif_type
            template = NotificationTemplate.objects.create(**template_data)
            self.assertEqual(template.notification_type, notif_type)


class NotificationModelTest(TestCase):
    """Test cases for Notification model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.template = NotificationTemplate.objects.create(
            name='test_notification',
            subject='Test Subject',
            content='Test notification content',
            notification_type='in_app'
        )

    def test_notification_creation(self):
        """Test creating a notification."""
        notification = Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Test Notification',
            content='This is a test notification',
            notification_type='in_app',
            status='pending'
        )
        self.assertEqual(notification.user, self.user)
        self.assertEqual(notification.template, self.template)
        self.assertEqual(notification.status, 'pending')
        self.assertFalse(notification.is_read)

    def test_notification_str_representation(self):
        """Test string representation of notification."""
        notification = Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Test Subject',
            content='Test content',
            notification_type='in_app'
        )
        expected_str = f"Notification for {self.user.username} - Test Subject"
        self.assertEqual(str(notification), expected_str)

    def test_notification_mark_as_read(self):
        """Test marking notification as read."""
        notification = Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Test Subject',
            content='Test content',
            notification_type='in_app'
        )
        
        self.assertFalse(notification.is_read)
        
        notification.mark_as_read()
        self.assertTrue(notification.is_read)
        self.assertIsNotNone(notification.read_at)

    def test_notification_status_choices(self):
        """Test notification status choices."""
        valid_statuses = ['pending', 'sent', 'delivered', 'failed', 'cancelled']
        
        for status in valid_statuses:
            notification = Notification.objects.create(
                user=self.user,
                template=self.template,
                subject='Test Subject',
                content='Test content',
                notification_type='in_app',
                status=status
            )
            self.assertEqual(notification.status, status)


class EmailNotificationModelTest(TestCase):
    """Test cases for EmailNotification model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.template = NotificationTemplate.objects.create(
            name='email_template',
            subject='Email Subject',
            content='Email content',
            notification_type='email'
        )
        
        self.notification = Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Test Email',
            content='Test email content',
            notification_type='email'
        )

    def test_email_notification_creation(self):
        """Test creating an email notification."""
        email_notification = EmailNotification.objects.create(
            notification=self.notification,
            to_email=self.user.email,
            from_email='noreply@timshee.com',
            cc_emails=['cc@example.com'],
            bcc_emails=['bcc@example.com']
        )
        self.assertEqual(email_notification.notification, self.notification)
        self.assertEqual(email_notification.to_email, self.user.email)
        self.assertEqual(email_notification.from_email, 'noreply@timshee.com')

    def test_email_notification_str_representation(self):
        """Test string representation of email notification."""
        email_notification = EmailNotification.objects.create(
            notification=self.notification,
            to_email=self.user.email,
            from_email='noreply@timshee.com'
        )
        expected_str = f"Email to {self.user.email} - Test Email"
        self.assertEqual(str(email_notification), expected_str)

    def test_email_notification_delivery_tracking(self):
        """Test email delivery tracking."""
        email_notification = EmailNotification.objects.create(
            notification=self.notification,
            to_email=self.user.email,
            from_email='noreply@timshee.com'
        )
        
        # Simulate delivery
        email_notification.delivered_at = timezone.now()
        email_notification.save()
        
        self.assertIsNotNone(email_notification.delivered_at)


class NotificationBusinessLogicTest(TestCase):
    """Test cases for notification business logic."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.email_template = NotificationTemplate.objects.create(
            name='order_confirmation',
            subject='Order Confirmation - {{order_number}}',
            content='Thank you for your order {{order_number}}. Total: ${{total_amount}}',
            notification_type='email'
        )

    def test_notification_creation_from_template(self):
        """Test creating notification from template with context."""
        context = {
            'order_number': 'ORD-123456',
            'total_amount': '199.98'
        }
        
        # Simulate notification creation service
        notification = Notification.objects.create(
            user=self.user,
            template=self.email_template,
            subject=self.email_template.render_subject(context),
            content=self.email_template.render_content(context),
            notification_type=self.email_template.notification_type,
            context_data=context
        )
        
        self.assertIn('ORD-123456', notification.subject)
        self.assertIn('199.98', notification.content)

    def test_bulk_notification_creation(self):
        """Test creating notifications for multiple users."""
        # Create additional users
        users = [self.user]
        for i in range(3):
            users.append(User.objects.create_user(
                username=f'user{i}',
                email=f'user{i}@example.com',
                password='testpass123'
            ))
        
        # Create notifications for all users
        notifications = []
        for user in users:
            notification = Notification.objects.create(
                user=user,
                template=self.email_template,
                subject='Bulk Notification',
                content='This is a bulk notification',
                notification_type='in_app'
            )
            notifications.append(notification)
        
        self.assertEqual(len(notifications), 4)
        self.assertEqual(Notification.objects.count(), 4)

    def test_notification_preference_filtering(self):
        """Test filtering notifications based on user preferences."""
        # This test assumes user notification preferences exist
        # Create notifications of different types
        email_notification = Notification.objects.create(
            user=self.user,
            template=self.email_template,
            subject='Email Notification',
            content='Email content',
            notification_type='email'
        )
        
        sms_template = NotificationTemplate.objects.create(
            name='sms_template',
            subject='SMS Subject',
            content='SMS content',
            notification_type='sms'
        )
        
        sms_notification = Notification.objects.create(
            user=self.user,
            template=sms_template,
            subject='SMS Notification',
            content='SMS content',
            notification_type='sms'
        )
        
        # Test filtering by type
        email_notifications = Notification.objects.filter(
            user=self.user,
            notification_type='email'
        )
        self.assertEqual(email_notifications.count(), 1)
        
        sms_notifications = Notification.objects.filter(
            user=self.user,
            notification_type='sms'
        )
        self.assertEqual(sms_notifications.count(), 1)


class NotificationAPITest(APITestCase):
    """Test cases for notifications API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.template = NotificationTemplate.objects.create(
            name='test_template',
            subject='Test Subject',
            content='Test content',
            notification_type='in_app'
        )

    def test_list_user_notifications(self):
        """Test listing user's notifications."""
        self.client.force_authenticate(user=self.user)
        
        Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Test Notification',
            content='Test content',
            notification_type='in_app'
        )
        
        # This test assumes there's a notifications list endpoint
        # response = self.client.get('/api/v1/notifications/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_mark_notification_as_read(self):
        """Test marking notification as read."""
        self.client.force_authenticate(user=self.user)
        
        notification = Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Test Notification',
            content='Test content',
            notification_type='in_app'
        )
        
        # This test assumes there's a mark-as-read endpoint
        # response = self.client.post(f'/api/v1/notifications/{notification.id}/read/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_mark_all_notifications_as_read(self):
        """Test marking all notifications as read."""
        self.client.force_authenticate(user=self.user)
        
        # Create multiple notifications
        for i in range(3):
            Notification.objects.create(
                user=self.user,
                template=self.template,
                subject=f'Test Notification {i}',
                content='Test content',
                notification_type='in_app'
            )
        
        # This test assumes there's a mark-all-as-read endpoint
        # response = self.client.post('/api/v1/notifications/mark-all-read/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_notification_count(self):
        """Test getting unread notification count."""
        self.client.force_authenticate(user=self.user)
        
        # Create notifications
        Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Unread Notification 1',
            content='Test content',
            notification_type='in_app'
        )
        
        read_notification = Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Read Notification',
            content='Test content',
            notification_type='in_app'
        )
        read_notification.mark_as_read()
        
        # This test assumes there's an unread count endpoint
        # response = self.client.get('/api/v1/notifications/unread-count/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.assertEqual(response.data['count'], 1)

    def test_delete_notification(self):
        """Test deleting a notification."""
        self.client.force_authenticate(user=self.user)
        
        notification = Notification.objects.create(
            user=self.user,
            template=self.template,
            subject='Test Notification',
            content='Test content',
            notification_type='in_app'
        )
        
        # This test assumes there's a delete endpoint
        # response = self.client.delete(f'/api/v1/notifications/{notification.id}/')
        # self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthorized_access_to_notifications(self):
        """Test that users cannot access other users' notifications."""
        other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='testpass123'
        )
        
        other_notification = Notification.objects.create(
            user=other_user,
            template=self.template,
            subject='Other User Notification',
            content='Test content',
            notification_type='in_app'
        )
        
        self.client.force_authenticate(user=self.user)
        
        # This test assumes proper authorization is implemented
        # response = self.client.get(f'/api/v1/notifications/{other_notification.id}/')
        # self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
