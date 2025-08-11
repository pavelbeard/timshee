"""
Shopping app configuration.
"""

from django.apps import AppConfig


class ShoppingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'src.apps.shopping'
    verbose_name = 'Shopping'
