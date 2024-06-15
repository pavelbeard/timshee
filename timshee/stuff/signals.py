import django
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db.models.signals import post_save
from django.dispatch import receiver

from . import models


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    try:
        if created:
            models.UserProfile.objects.create(user=instance)
        instance.userprofile.save()
    except django.contrib.auth.models.User.userprofile.RelatedObjectDoesNotExist:
        pass
    except IntegrityError:
        pass
