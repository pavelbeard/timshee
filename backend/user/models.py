import string

from django.contrib.auth import models as auth_models
from django.db import models
from django.utils.translation import gettext_lazy as _
from shortuuid.django_fields import ShortUUIDField

from .service import UserManager


class User(auth_models.AbstractBaseUser, auth_models.PermissionsMixin):
    id = ShortUUIDField(
        primary_key=True,
        editable=False,
        unique=True,
        verbose_name="ID",
        alphabet=string.ascii_uppercase + string.digits,
    )
    email = models.EmailField(unique=True, verbose_name=_("Email"))
    first_name = models.CharField(max_length=30, verbose_name=_("First Name"))
    last_name = models.CharField(max_length=30, verbose_name=_("Last Name"))
    is_staff = models.BooleanField(default=False, verbose_name=_("Is Staff"))
    is_superuser = models.BooleanField(default=False, verbose_name=_("Is Superuser"))
    is_active = models.BooleanField(default=True, verbose_name=_("Is Active"))
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name=_("Date Joined"))

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
