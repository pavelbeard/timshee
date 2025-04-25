from allauth.account import app_settings as allauth_settings
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailAddress
from allauth.account.utils import setup_user_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=allauth_settings.SIGNUP_FIELDS['email']['required'])
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate_email(self, email):
        if allauth_settings.UNIQUE_EMAIL:
            if email and EmailAddress.objects.is_verified(email):
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
                adapter.clean_password(self.cleaned_data['password'], user=user)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(
                    detail=serializers.as_serializer_error(exc)
                )
        user.save()
        setup_user_email(request, user, [])
        return user