from typing import override
from allauth.account.adapter import DefaultAccountAdapter


class CustomAccountAdapter(DefaultAccountAdapter):
    @override
    def save_user(self, request, user, form, commit=True):
        """
        Saves a new user instance from a user data form.
        Without username.
        """
        from allauth.account.utils import user_email, user_field

        data = form.cleaned_data
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")

        user_email(user, email)

        if first_name:
            user_field(user, "first_name", first_name)
        if last_name:
            user_field(user, "last_name", last_name)
        if "password" in data:
            user.set_password(data["password"])
        else:
            user.set_unusable_password()

        if commit:
            # Ability not to commit makes it easier to derive from
            # this adapter by adding
            user.save()

        return user
