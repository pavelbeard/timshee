from dj_rest_auth.registration.urls import (
    urlpatterns as default_registration_urlpatterns,
)
from dj_rest_auth.urls import (
    urlpatterns as default_login_urlpatterns,
)
from django.urls import include, path

from .views import CustomLoginView as LoginView
from .views import CustomRegisterView as RegisterView
from .views import get_refresh_view

registration_patterns = [
    path("", RegisterView.as_view(), name="rest_register"),
    *default_registration_urlpatterns[1:],
]

login_patterns = [
    url
    for url in default_login_urlpatterns
    if "token_refresh" not in str(url.name) and "rest_login" not in str(url.name)
]

login_patterns += [
    path("login/", LoginView.as_view(), name="rest_login"),
]

# Custom getter for the refresh view
token_patterns = [
    path("refresh/", get_refresh_view().as_view(), name="rest_token_refresh"),
]

urlpatterns = [
    path("", include(login_patterns)),
    path("registration/", include(registration_patterns)),
    path("token/", include(token_patterns)),
]
