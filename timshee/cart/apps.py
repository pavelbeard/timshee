# import logging
# import sys

from django.apps import AppConfig

# logging.basicConfig(level=logging.INFO, stream=sys.stdout)
# logger = logging.getLogger(__name__)
# logger.setLevel(level=logging.INFO)


class CartConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cart'

    # def ready(self):
    #     from . import signals
