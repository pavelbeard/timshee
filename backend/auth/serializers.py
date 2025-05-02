from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailAddress
from allauth.account.utils import setup_user_email
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt import serializers as jwt_serializers
from rest_framework_simplejwt.settings import api_settings


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(
        required=allauth_settings.SIGNUP_FIELDS["email"]["required"]
    )
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_email(self, email):
        if allauth_settings.UNIQUE_EMAIL:
            if email and EmailAddress.objects.filter(email=email).exists():
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."),
                )
        return email

    def validate_password(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data["password"] != data["password2"]:
            raise serializers.ValidationError(_("Passwords do not match."))
        return data

    def get_cleaned_data(self):
        return {
            "first_name": self.validated_data.get("first_name", ""),
            "last_name": self.validated_data.get("last_name", ""),
            "email": self.validated_data.get("email", ""),
            "password": self.validated_data.get("password", ""),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        user = adapter.save_user(request, user, self, commit=False)
        if "password" in self.cleaned_data:
            try:
                adapter.clean_password(self.cleaned_data["password"], user=user)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(
                    detail=serializers.as_serializer_error(exc)
                )
        user.save()
        setup_user_email(request, user, [])
        return user


class CustomRefreshSerializer(jwt_serializers.TokenRefreshSerializer):
    """
    Custom serializer to handle the refresh token response.
    """

    def validate(self, attrs):
        refresh = self.token_class(attrs["refresh"])

        # TODO: Find out how to use settings 
        user_id = refresh.payload.get(api_settings.USER_ID_CLAIM, None)
        if user_id and (
            user := get_user_model().objects.get(
                **{api_settings.USER_ID_FIELD: user_id}
            )
        ):
            if not api_settings.USER_AUTHENTICATION_RULE(user):
                raise AuthenticationFailed(
                    self.error_messages["no_active_account"],
                    "no_active_account",
                )

        #  Changing name of the access token to match the one in the login response
        data = {settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"]: str(refresh.access_token)}

        if api_settings.ROTATE_REFRESH_TOKENS:
            if api_settings.BLACKLIST_AFTER_ROTATION:
                try:
                    # Attempt to blacklist the given refresh token
                    refresh.blacklist()
                except AttributeError:
                    # If blacklist app not installed, `blacklist` method will
                    # not be present
                    pass

            refresh.set_jti()
            refresh.set_exp()
            refresh.set_iat()
            refresh.outstand()

            data["refresh"] = str(refresh)

        return data


class CustomCookieTokenRefreshSerializer(CustomRefreshSerializer):
    """
    Same as the default CookieTokenRefreshSerializer, but inherits from
    CustomRefreshSerializer to use the custom access token name.
    """

    refresh = serializers.CharField(
        required=False, help_text=_("Will override cookie.")
    )

    def extract_refresh_token(self):
        request = self.context["request"]
        if "refresh" in request.data and request.data["refresh"] != "":
            return request.data["refresh"]
        cookie_name = settings.REST_AUTH["JWT_AUTH_REFRESH_COOKIE"]
        if cookie_name and cookie_name in request.COOKIES:
            return request.COOKIES.get(cookie_name)
        else:
            from rest_framework_simplejwt.exceptions import InvalidToken

            raise InvalidToken(_("No valid refresh token found."))

    def validate(self, attrs):
        attrs["refresh"] = self.extract_refresh_token()
        return super().validate(attrs)
