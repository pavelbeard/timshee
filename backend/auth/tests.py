from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.serializers import ErrorDetail

from .serializers import RegisterSerializer

# UNIT TESTS


User = get_user_model()


class TestRegisterSerializer(TestCase):
    def setUp(self):
        self.register_serializer = RegisterSerializer

    def test_should_throw_a_password_validation_error(self):
        data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "test123",
            "password2": "test123",
        }

        serializer = self.register_serializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors,
            {
                "password": [
                    ErrorDetail(
                        string="This password is too short. It must contain at least 8 characters.",
                        code="password_too_short",
                    ),
                    ErrorDetail(
                        string="This password is too common.",
                        code="password_too_common",
                    ),
                ]
            },
        )

    def test_should_throw_a_password_mismatch_error(self):
        data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!1234",
        }

        serializer = self.register_serializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors,
            {
                "non_field_errors": [
                    ErrorDetail(string="Passwords do not match.", code="invalid")
                ]
            },
        )

    def test_should_throw_an_email_error(self):
        data = {
            "email": "testexample.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!123",
        }

        serializer = self.register_serializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors,
            {
                "email": [
                    ErrorDetail(string="Enter a valid email address.", code="invalid")
                ]
            },
        )

    def test_should_throw_an_email_error_unique(self):
        user = User.objects.create_user(
            email="test@example.com",
            first_name="Test",
            last_name="User",
            password="OJest!123",
        )

        EmailAddress.objects.create(
            user=user,
            email="test@example.com",
            verified=True,
        )

        data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!123",
        }

        serializer = self.register_serializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(
            serializer.errors,
            {
                "email": [
                    ErrorDetail(
                        string="A user is already registered with this e-mail address.",
                        code="invalid",
                    )
                ]
            },
        )

    def test_should_be_success_validation(self):
        data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!123",
        }

        serializer = self.register_serializer(data=data)

        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.errors, {})
        self.assertEqual(serializer.validated_data, data)
