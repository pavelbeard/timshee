from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q
from rest_framework.exceptions import ValidationError

User = get_user_model()


class EmailAuthenticationBackend(ModelBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        if email is None or password is None:
            return None
        try:
            user = User.objects.get(Q(email=email) | Q(username=email))
            # user = User.objects.first()
            if user.check_password(password):
                return user

        except User.DoesNotExist:
            return ValidationError("User not found.")
        return None
