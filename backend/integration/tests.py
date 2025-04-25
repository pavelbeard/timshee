from django.test import TestCase
from django.test.utils import override_settings


class TestCustomRegister(TestCase):
    def setUp(self):
        self.data = {
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "OJest!123",
            "password2": "OJest!123",
        }

    def test_should_throw_a_password_validation_error(self):
        self.data["password"] = "short"

        response = self.client.post("/api/auth/registration/", self.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["password"][0].code, "password_too_short")

    def test_should_throw_an_email_validation_error(self):
        self.data["email"] = "testexample.com"

        response = self.client.post("/api/auth/registration/", self.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["email"][0].code, "invalid")

    def test_should_throw_a_password_mismatch_error(self):
        self.data["password2"] = "OJest!1234"

        response = self.client.post("/api/auth/registration/", self.data)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["non_field_errors"][0].code, "invalid")

    @override_settings(
        REST_AUTH={
            "REGISTER_SERIALIZER": "auth.serializers.RegisterSerializer",
        },
        ACCOUNT_ADAPTER="auth.services.CustomAccountAdapter",
    )
    def test_should_be_success(self):
        from django.conf import settings

        assert settings.REST_AUTH == {
            "REGISTER_SERIALIZER": "auth.serializers.RegisterSerializer",
        }
        assert settings.ACCOUNT_ADAPTER == "auth.services.CustomAccountAdapter"

        response = self.client.post("/api/auth/registration/", self.data)

        self.assertEqual(response.status_code, 201)
