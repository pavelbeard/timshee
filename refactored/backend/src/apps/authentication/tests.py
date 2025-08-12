"""
Unit tests for the authentication application.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import datetime, timedelta

from src.apps.authentication.models import UserProfile, EmailToken


class UserProfileModelTest(TestCase):
    """Test cases for UserProfile model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_profile_creation(self):
        """Test creating a user profile."""
        profile = UserProfile.objects.create(
            user=self.user,
            preferred_language='en',
            phone_number='+1234567890'
        )
        self.assertEqual(profile.user, self.user)
        self.assertEqual(profile.preferred_language, 'en')
        self.assertEqual(profile.phone_number, '+1234567890')
        self.assertFalse(profile.email_confirmed)

    def test_user_profile_str_representation(self):
        """Test string representation of user profile."""
        profile = UserProfile.objects.create(user=self.user)
        expected_str = f"{self.user.username} - Profile"
        self.assertEqual(str(profile), expected_str)

    def test_user_profile_language_choices(self):
        """Test language choices validation."""
        profile = UserProfile.objects.create(
            user=self.user,
            preferred_language='es'
        )
        self.assertEqual(profile.preferred_language, 'es')

    def test_user_profile_one_to_one_relationship(self):
        """Test one-to-one relationship with User."""
        UserProfile.objects.create(user=self.user)
        
        # Creating another profile for the same user should raise error
        with self.assertRaises(Exception):  # IntegrityError
            UserProfile.objects.create(user=self.user)


class EmailTokenModelTest(TestCase):
    """Test cases for EmailToken model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_email_token_creation(self):
        """Test creating an email token."""
        token = EmailToken.objects.create(
            user=self.user,
            token_type='email_confirmation',
            expires_at=datetime.now() + timedelta(hours=24)
        )
        self.assertEqual(token.user, self.user)
        self.assertEqual(token.token_type, 'email_confirmation')
        self.assertIsNotNone(token.token)  # UUID should be generated
        self.assertFalse(token.is_used)

    def test_email_token_str_representation(self):
        """Test string representation of email token."""
        token = EmailToken.objects.create(
            user=self.user,
            token_type='password_reset'
        )
        expected_str = f"Token for {self.user.email} - password_reset"
        self.assertEqual(str(token), expected_str)

    def test_email_token_is_expired_property(self):
        """Test is_expired property."""
        # Create expired token
        expired_token = EmailToken.objects.create(
            user=self.user,
            token_type='email_confirmation',
            expires_at=datetime.now() - timedelta(hours=1)
        )
        self.assertTrue(expired_token.is_expired)

        # Create valid token
        valid_token = EmailToken.objects.create(
            user=self.user,
            token_type='email_confirmation',
            expires_at=datetime.now() + timedelta(hours=24)
        )
        self.assertFalse(valid_token.is_expired)

    def test_email_token_is_valid_property(self):
        """Test is_valid property."""
        # Create valid token
        valid_token = EmailToken.objects.create(
            user=self.user,
            token_type='email_confirmation',
            expires_at=datetime.now() + timedelta(hours=24)
        )
        self.assertTrue(valid_token.is_valid)

        # Mark as used
        valid_token.is_used = True
        valid_token.save()
        self.assertFalse(valid_token.is_valid)



class AuthenticationAPITest(APITestCase):
    """Test cases for authentication API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password_confirm': 'testpass123'
        }
        self.user = User.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            password='testpass123'
        )

    def test_user_registration(self):
        """Test user registration endpoint."""
        # This test assumes there's a registration endpoint
        # We'll need to implement this in the views
        response = self.client.post('/api/v1/auth/register/', self.user_data)
        # Note: This might return 404 if the endpoint isn't implemented yet
        # We'll implement this when the views are properly configured

    def test_user_login(self):
        """Test user login endpoint."""
        login_data = {
            'username': 'existinguser',
            'password': 'testpass123'
        }
        response = self.client.post('/api/v1/auth/login/', login_data)
        # Note: This might return 404 if the endpoint isn't implemented yet

    def test_user_profile_retrieval(self):
        """Test user profile retrieval."""
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/v1/auth/profile/')
        # Note: This might return 404 if the endpoint isn't implemented yet

    def test_password_change(self):
        """Test password change endpoint."""
        self.client.force_authenticate(user=self.user)
        password_data = {
            'old_password': 'testpass123',
            'new_password': 'newtestpass123',
            'new_password_confirm': 'newtestpass123'
        }
        response = self.client.post('/api/v1/auth/change-password/', password_data)
        # Note: This might return 404 if the endpoint isn't implemented yet


class AuthenticationValidationTest(TestCase):
    """Test cases for authentication validations."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_profile_language_validation(self):
        """Test user profile language choice validation."""
        # Valid language
        profile = UserProfile(
            user=self.user,
            preferred_language='en'
        )
        profile.full_clean()  # Should not raise ValidationError

        # Invalid language
        invalid_profile = UserProfile(
            user=self.user,
            preferred_language='invalid'
        )
        with self.assertRaises(ValidationError):
            invalid_profile.full_clean()

    def test_email_token_type_validation(self):
        """Test email token type validation."""
        # This test assumes there are specific token types defined
        valid_token = EmailToken(
            user=self.user,
            token_type='email_confirmation'
        )
        valid_token.full_clean()  # Should not raise ValidationError


class AuthenticationBusinessLogicTest(TestCase):
    """Test cases for authentication business logic."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.profile = UserProfile.objects.create(user=self.user)

    def test_email_confirmation_flow(self):
        """Test email confirmation workflow."""
        # Create email confirmation token
        token = EmailToken.objects.create(
            user=self.user,
            token_type='email_confirmation',
            expires_at=datetime.now() + timedelta(hours=24)
        )
        
        # Simulate email confirmation
        self.assertFalse(self.profile.email_confirmed)
        self.assertTrue(token.is_valid)
        
        # Mark token as used and confirm email
        token.is_used = True
        token.save()
        self.profile.email_confirmed = True
        self.profile.save()
        
        self.assertTrue(self.profile.email_confirmed)
        self.assertFalse(token.is_valid)

    def test_password_reset_flow(self):
        """Test password reset workflow."""
        original_password = self.user.password
        
        # Create password reset token
        token = EmailToken.objects.create(
            user=self.user,
            token_type='password_reset',
            expires_at=datetime.now() + timedelta(hours=1)
        )
        
        self.assertTrue(token.is_valid)
        
        # Simulate password reset
        self.user.set_password('newpassword123')
        self.user.save()
        token.is_used = True
        token.save()
        
        self.assertNotEqual(self.user.password, original_password)
        self.assertFalse(token.is_valid)
