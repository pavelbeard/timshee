from django.contrib.auth.models import User
from django.core.management import BaseCommand

from ... import models


class Command(BaseCommand):
    help = 'Create user profiles for existing users'

    def handle(self, *args, **kwargs):
        users_without_profile = User.objects.filter(userprofile__isnull=True)
        for user in users_without_profile:
            models.UserProfile.objects.create(user=user)
        self.stdout.write(self.style.SUCCESS('Successfully created user profiles for existing users'))