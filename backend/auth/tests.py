import pytest
from allauth.account.models import EmailAddress
from django.contrib.auth import get_user_model
from rest_framework.serializers import ErrorDetail

from .serializers import RegisterSerializer

User = get_user_model()


@pytest.fixture
def register_serializer():
    return RegisterSerializer


@pytest.mark.django_db
class TestRegisterSerializer:
    def test_should_throw_a_password_validation_error(self, register_serializer):
        data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "test123",
            "password2": "test123",
        }

        serializer = register_serializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors == {
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
        }

    def test_should_throw_a_password_mismatch_error(self, register_serializer):
        data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!1234",
        }

        serializer = register_serializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors == {
            "non_field_errors": [
                ErrorDetail(string="Passwords do not match.", code="invalid")
            ]
        }

    def test_should_throw_an_email_error(self, register_serializer):
        data = {
            "email": "testexample.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!123",
        }

        serializer = register_serializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors == {
            "email": [
                ErrorDetail(string="Enter a valid email address.", code="invalid")
            ]
        }

    def test_should_throw_an_email_error_unique(self, register_serializer):
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

        serializer = register_serializer(data=data)

        assert not serializer.is_valid()
        assert serializer.errors == {
            "email": [
                ErrorDetail(
                    string="A user is already registered with this e-mail address.",
                    code="invalid",
                )
            ]
        }

    def test_should_throw_an_email_error_unique_case_insensitive(
        self, register_serializer
    ):
        user = User.objects.create_user(
            email="test@example.com",
            first_name="Test",
            last_name="User",
            password="OJest!123",
        )
        EmailAddress.objects.create(
            user=user,
            email="test@example.com",
        )

        data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!123",
        }
        serializer = register_serializer(data=data)
        assert not serializer.is_valid()
        assert serializer.errors == {
            "email": [
                ErrorDetail(
                    string="A user is already registered with this e-mail address.",
                    code="invalid",
                )
            ]
        }

    def test_should_be_success_validation(self, register_serializer):
        data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!123",
        }

        serializer = register_serializer(data=data)

        assert serializer.is_valid()
        assert serializer.errors == {}
        assert serializer.validated_data == data
