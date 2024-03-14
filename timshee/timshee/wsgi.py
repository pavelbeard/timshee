"""
WSGI config for timshee project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

settings = os.environ.get("DJANGO_SETTINGS_VERSION", "development")

if settings == "development":
    settings = 'timshee.settings'
elif settings == "production":
    settings = 'timshee.settings_enterprise'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings)

application = get_wsgi_application()
