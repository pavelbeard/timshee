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


@pytest.mark.django_db
def test_should_throw_a_password_validation_error(client, registration_data):
    registration_data["password"] = "short"
    response = client.post("/api/auth/registration/", registration_data)

    assert response.status_code == 400
    assert response.data["password"][0].code == "password_too_short"


@pytest.mark.django_db
def test_should_throw_an_email_validation_error(client, registration_data):
    registration_data["email"] = "testexample.com"
    response = client.post("/api/auth/registration/", registration_data)

    assert response.status_code == 400
    assert response.data["email"][0].code == "invalid"


@pytest.mark.django_db
def test_should_throw_a_password_mismatch_error(client, registration_data):
    registration_data["password2"] = "OJest!1234"
    response = client.post("/api/auth/registration/", registration_data)

    assert response.status_code == 400
    assert response.data["non_field_errors"][0].code == "invalid"


@pytest.mark.django_db
def test_should_throw_an_email_already_exists_error(client, registration_data):
    client.post("/api/auth/registration/", registration_data)
    response = client.post("/api/auth/registration/", registration_data)

    assert response.status_code == 400
    assert response.data["email"][0].code == "invalid"


@pytest.mark.django_db
def test_should_be_success(client, registration_data):
    response = client.post("/api/auth/registration/", registration_data)

    assert response.status_code == 201
    assert "access" not in response.data
    assert "refresh" not in response.data


@pytest.mark.django_db
def test_login_should_throw_a_password_validation_error(client, login_data):
    login_data["password"] = "short"
    response = client.post("/api/auth/login/", login_data)

    assert response.status_code == 400
    assert response.data["non_field_errors"][0].code == "invalid"


@pytest.mark.django_db
def test_login_should_throw_an_email_validation_error(client, login_data):
    login_data["email"] = "testexample.com"
    response = client.post("/api/auth/login/", login_data)

    assert response.status_code == 400
    assert response.data["email"][0].code == "invalid"


@pytest.mark.django_db
def test_login_should_be_success(client, login_data, set_jwt_settings):
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
    assert "__rclientid" in response.client.cookies
