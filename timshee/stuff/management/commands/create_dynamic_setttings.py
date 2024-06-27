from django.core.management import BaseCommand

from ... import models


class Command(BaseCommand):
    help = 'Create dynamic settings before start the app'

    def handle(self, *args, **kwargs):
        dyn_settings, not_created = models.DynamicSettings.objects.get_or_create(pk=1)

        if not_created:
            models.DynamicSettings.objects.create(
                on_content_update=False,
                on_maintenance=False
            )

            self.stdout.write(self.style.SUCCESS('Successfully created dynamic settings for store'))
        else:
            self.stdout.write(self.style.SUCCESS('Dynamic settings already exist'))
