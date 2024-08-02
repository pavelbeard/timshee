from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from rest_framework.exceptions import ValidationError

User = get_user_model()


class EmailAuthenticationBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None or password is None:
            return None
        try:
            user = User.objects.filter(email=username).first()
            if user.check_password(password):
                return user

        except User.DoesNotExist:
            return ValidationError("User not found")
        return None
