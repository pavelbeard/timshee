from django.contrib.auth import models as auth_models
from django.utils import timezone


class UserManager(auth_models.BaseUserManager):
    def _create_user(
        self, email, password, is_staff, is_superuser, is_active, **extra_fields
    ):
        if not email:
            raise ValueError("The given email must be set")

        now = timezone.now()
        email = self.normalize_email(email)

        user = self.model(
            email=email,
            is_staff=is_staff,
            is_superuser=is_superuser,
            is_active=is_active,
            last_login=now,
            date_joined=now,
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        return self._create_user(email, password, False, False, True, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        return self._create_user(email, password, True, True, True, **extra_fields)
