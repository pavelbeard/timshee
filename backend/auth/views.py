from allauth.account import app_settings as allauth_account_settings
from dj_rest_auth.app_settings import api_settings
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.response import Response

# Create your views here.
from .serializers import CustomCookieTokenRefreshSerializer


class CustomRegisterView(RegisterView):
    """
    Registers a new user without return a token pair
    """

    def get_response_data(self, user):
        if (
            allauth_account_settings.EMAIL_VERIFICATION
            == allauth_account_settings.EmailVerificationMethod.MANDATORY
        ):
            return {"detail": _("Verification e-mail sent.")}

        if api_settings.USE_JWT:
            data = {
                "user": user,
                "access": self.access_token,
                "refresh": self.refresh_token,
            }

            serialized_data = api_settings.JWT_SERIALIZER(
                data, context=self.get_serializer_context()
            ).data
            # Remove the access and refresh tokens from the response
            serialized_data.pop("access", None)
            serialized_data.pop("refresh", None)
            # Return the serialized data without the tokens
            return serialized_data
        elif self.token_model:
            return api_settings.TOKEN_SERIALIZER(
                user.auth_token, context=self.get_serializer_context()
            ).data
        return None


class CustomLoginView(LoginView):
    """
    Login view that returns a token pair, but does not return the refresh token in the DATA response, rather in cookies.
    """

    def get_response(self):
        serializer_class = self.get_response_serializer()

        if api_settings.USE_JWT:
            from rest_framework_simplejwt.settings import api_settings as jwt_settings

            access_token_expiration = (
                timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME
            )
            refresh_token_expiration = (
                timezone.now() + jwt_settings.REFRESH_TOKEN_LIFETIME
            )
            return_expiration_times = api_settings.JWT_AUTH_RETURN_EXPIRATION
            auth_httponly = api_settings.JWT_AUTH_HTTPONLY

            data = {
                "user": self.user,
                "access": self.access_token,
            }

            if not auth_httponly:
                data["refresh"] = self.refresh_token
            else:
                # Wasnt sure if the serializer needed this
                data["refresh"] = ""

            if return_expiration_times:
                data["access_expiration"] = access_token_expiration
                data["refresh_expiration"] = refresh_token_expiration

            serializer = serializer_class(
                instance=data,
                context=self.get_serializer_context(),
            )
        elif self.token:
            serializer = serializer_class(
                instance=self.token,
                context=self.get_serializer_context(),
            )
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

        response = Response(serializer.data, status=status.HTTP_200_OK)

        if api_settings.USE_JWT:
            # rename the access token to the one defined in settings
            from django.conf import settings

            response.data[settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"]] = response.data.pop(
                "access"
            )
            # pop the refresh token from the response data, because it will be set in the cookie
            response.data.pop("refresh", None)

            from dj_rest_auth.jwt_auth import set_jwt_refresh_cookie

            set_jwt_refresh_cookie(response, self.refresh_token)
        return response


def get_refresh_view():
    """
    Returns the refresh view for the JWT authentication.

    Contains a custom serializer in order to change access token name.
    """
    from dj_rest_auth.jwt_auth import get_refresh_view as get_refresh_view_dj_rest_auth

    custom_refresh_view_with_cookie_support = get_refresh_view_dj_rest_auth()
    custom_refresh_view_with_cookie_support.serializer_class = (
        CustomCookieTokenRefreshSerializer
    )

    return custom_refresh_view_with_cookie_support
