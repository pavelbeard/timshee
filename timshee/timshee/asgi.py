"""
ASGI config for timshee project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

settings = os.environ.get("DJANGO_SETTINGS_VERSION", "development")

if settings == "development":
    settings = 'timshee.settings'
elif settings == "production":
    settings = 'timshee.settings_enterprise'

application = get_asgi_application()
