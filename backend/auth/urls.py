from dj_rest_auth.registration.urls import (
    urlpatterns as default_registration_urlpatterns,
)
from dj_rest_auth.urls import (
    urlpatterns as default_login_urlpatterns,
)
from django.urls import include, path

from .views import CustomLoginView as LoginView
from .views import CustomRegisterView as RegisterView

registration_patterns = [
    path("", RegisterView.as_view(), name="rest_register"),
    *default_registration_urlpatterns[1:],
]

login_patterns = [
    url for url in default_login_urlpatterns if "login" not in str(url.pattern)
]

login_patterns += [
    path("login/", LoginView.as_view(), name="rest_login"),
]

urlpatterns = [
    path("", include(login_patterns)),
    path("registration/", include(registration_patterns)),
]
