import pytest
from rest_framework.test import APIClient


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def registration_data():
    return {
        "email": "test@example.com",
        "first_name": "Test",
        "last_name": "User",
        "password": "OJest!123",
        "password2": "OJest!123",
    }


@pytest.fixture
def login_data():
    return {
        "email": "noxclox@gmail.com",
        "password": "OJest!123",
    }


@pytest.fixture
def set_jwt_settings(settings):
    settings.REST_AUTH["JWT_AUTH_REFRESH_COOKIE"] = "__rclientid"
    settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"] = "__clientid"
    settings.SIMPLE_JWT["USER_ID_CLAIM"] = "user_id"
    settings.SIMPLE_JWT["USER_ID_FIELD"] = "id"

    

@pytest.mark.django_db
class TestRegistration:
    def test_should_throw_a_password_validation_error(self, client, registration_data):
        registration_data["password"] = "short"
        response = client.post("/api/auth/registration/", registration_data)

        assert response.status_code == 400
        assert response.data["password"][0].code == "password_too_short"

    def test_should_throw_an_email_validation_error(self, client, registration_data):
        registration_data["email"] = "testexample.com"
        response = client.post("/api/auth/registration/", registration_data)

        assert response.status_code == 400
        assert response.data["email"][0].code == "invalid"

    def test_should_throw_a_password_mismatch_error(self, client, registration_data):
        registration_data["password2"] = "OJest!1234"
        response = client.post("/api/auth/registration/", registration_data)

        assert response.status_code == 400
        assert response.data["non_field_errors"][0].code == "invalid"

    def test_should_throw_an_email_already_exists_error(self, client, registration_data):
        client.post("/api/auth/registration/", registration_data)
        response = client.post("/api/auth/registration/", registration_data)

        assert response.status_code == 400
        assert response.data["email"][0].code == "invalid"

    def test_should_be_success(self, client, registration_data):
        response = client.post("/api/auth/registration/", registration_data)

        assert response.status_code == 201
        assert "access" not in response.data
        assert "refresh" not in response.data


@pytest.mark.django_db
class TestLogin:
    def test_login_should_throw_a_password_validation_error(self, client, login_data):
        login_data["password"] = "short"
        response = client.post("/api/auth/login/", login_data)

        assert response.status_code == 400
        assert response.data["non_field_errors"][0].code == "invalid"

    def test_login_should_throw_an_email_validation_error(self, client, login_data):
        login_data["email"] = "testexample.com"
        response = client.post("/api/auth/login/", login_data)

        assert response.status_code == 400
        assert response.data["email"][0].code == "invalid"

    def test_login_should_be_success(self, client, login_data, set_jwt_settings):
        registration_data = {
            "email": login_data["email"],
            "first_name": "Nox",
            "last_name": "Clox",
            "password": login_data["password"],
            "password2": login_data["password"],
        }
        client.post("/api/auth/registration/", registration_data)

        response = client.post("/api/auth/login/", login_data)

        assert response.status_code == 200
        assert "__clientid" in response.data
        assert "refresh" not in response.data
        assert "__rclientid" in response.client.cookies
        

@pytest.mark.django_db
class TestRefreshTokenSerializer:
    def test_should_be_success_validation(self, client, set_jwt_settings, login_data):
        registration_data = {
            "email": login_data["email"],
            "first_name": "Nox",
            "last_name": "Clox",
            "password": login_data["password"],
            "password2": login_data["password"],
        }
        client.post("/api/auth/registration/", registration_data)
        
        # Login to get the refresh token
        response = client.post("/api/auth/login/", login_data)
        
        refresh_token = response.client.cookies["__rclientid"].value
        assert refresh_token is not None
        assert response.status_code == 200
        
        # Use the refresh token to get a new access token
        response = client.post(
            "/api/auth/token/refresh/",
            HTTP_COOKIE=f"__rclientid={refresh_token}",
        )
        
        assert response.status_code == 200
        assert "__clientid" in response.data
        assert "__rclientid" not in response.data
        assert "refresh" not in response.data
        assert response.client.cookies["__rclientid"].value is not None
        
