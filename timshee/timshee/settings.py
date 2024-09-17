"""
Django settings for timshee project.

Generated by 'django-admin startproject' using Django 5.0.3.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""
import os
import re
from datetime import timedelta
from pathlib import Path
from django.utils.translation import gettext_lazy as _

from corsheaders.defaults import default_headers
from mjml.settings import MJML_BACKEND_MODE, MJML_HTTPSERVERS

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "change_me")

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = bool(int(os.getenv("DJANGO_SETTINGS_DEBUG_MODE", 1)))
UNSTABLE = bool(int(os.getenv("DJANGO_SETTINGS_UNSTABLE_MODE", 0)))
PRODUCTION = bool(int(os.getenv("DJANGO_SETTINGS_PRODUCTION_MODE", 0)))

ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # custom
    "rest_framework",
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    "corsheaders",
    'colorfield',
    'django_filters',
    'mjml',
    'dragndrop_related',
    # my
    "store.apps.StoreConfig",
    "cart.apps.CartConfig",
    "order.apps.OrderConfig",
    "stuff.apps.StuffConfig",
    "payment.apps.PaymentConfig",
]

MIDDLEWARE = [
    'stuff.middleware.AuthSubstitutionMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    # custom
    'corsheaders.middleware.CorsMiddleware',
    # 'debug_toolbar.middleware.DebugToolbarMiddleware' if (DEBUG or TESTING) else "",
]

if DEBUG:
    INTERNAL_IPS = [
        "localhost",
        "127.0.0.1",
    ]

ROOT_URLCONF = 'timshee.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'mjml_templates',
            BASE_DIR / 'stuff',
            BASE_DIR / 'order'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # custom
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

WSGI_APPLICATION = 'timshee.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        },

    }
elif UNSTABLE or PRODUCTION:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv("POSTGRES_DB_NAME"),
            'USER': os.getenv("POSTGRES_DB_USER"),
            'PASSWORD': os.getenv("POSTGRES_DB_PASSWORD"),
            'HOST': 'postgresql',
            'PORT': os.getenv("POSTGRES_DB_PORT"),
        }
    }

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

# LANGUAGE_CODE = 'ru'

LANGUAGE_COOKIE_NAME = 'server_language'
LANGUAGE_COOKIE_AGE = 60 * 60 * 24 * 30
LANGUAGES = (
    ('en', _('English')),
    ('es', _('Spanish')),
    ('ru', _('Russian')),
)

TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

LOCALE_PATHS = (
    BASE_DIR / 'locale',
)

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

if DEBUG:
    STATIC_URL = '/static/'
else:
    STATIC_URL = '/backend/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# custom
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_ROOT = BASE_DIR / "media"

STATICFILES_DIRS = [
    BASE_DIR / 'stuff',
]

if DEBUG:
    MEDIA_URL = "/timshee/media/"
else:
    MEDIA_URL = "/backend/media/"

if DEBUG:
    CSRF_TRUSTED_ORIGINS = [
        "http://localhost:8112",
        "http://localhost:8113",
        "http://localhost:3000",
        "http://localhost:3002",
        "https://localhost",
        "http://127.0.0.1:8112",
        "http://127.0.0.1:8113",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3002",
        "https://127.0.0.1",
    ]
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:8112",
        "http://localhost:8113",
        "http://localhost:3000",
        "http://localhost:3002",
        "https://localhost",
        "http://127.0.0.1:8112",
        "http://127.0.0.1:8113",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3002",
        "https://127.0.0.1",
    ]
elif PRODUCTION or UNSTABLE:
    CSRF_TRUSTED_ORIGINS = re.split(r",|\s", os.getenv("ALLOWED_ORIGINS", ""))
    CORS_ALLOWED_ORIGINS = re.split(r",|\s", os.getenv("ALLOWED_ORIGINS", ""))

CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_NAME = 'csrfmiddlewaretoken'
CORS_ALLOWED_METHODS = ["GET", "POST", "PUT", "OPTIONS", "DELETE"]
CORS_ALLOW_CREDENTIALS = True

# settings.py

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE__X_FORWARDED_PROTO = True

DEFAULT_RENDERER_CLASSES = (
    'rest_framework.renderers.JSONRenderer',
)

if DEBUG:
    DEFAULT_RENDERER_CLASSES = DEFAULT_RENDERER_CLASSES + (
        'rest_framework.renderers.BrowsableAPIRenderer',
    )

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_RENDERER_CLASSES': DEFAULT_RENDERER_CLASSES,
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    # 'DEFAULT_PAGINATION_CLASS' : 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 9,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'stuff.authentication.EmailAuthenticationBackend',
)

SESSION_COOKIE_AGE = 60 * 60 * 24 * 14

# YOOKASSA

ACCOUNT_ID = os.getenv("ACCOUNT_ID")
API_KEY = os.getenv("SECRET_KEY")
CLIENT_REDIRECT = os.getenv("CLIENT_REDIRECT", "http://localhost:3000")

# JWT

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': os.getenv("DJANGO_SECRET_KEY", 'czrFjA4W3BaOfKpzo6eiSOiek42BWQN_RQ6fO-jL5yg'),
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ['JWT', 'Bearer'],
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ['rest_framework_simplejwt.tokens.AccessToken'],
    'TOKEN_TYPE_CLAIM': 'token_type',

    'AUTH_ACCESS_COOKIE': 'access_token',
    'AUTH_REFRESH_COOKIE': 'refresh_token',
    'AUTH_COOKIE_DOMAIN': None,
    'AUTH_COOKIE_SECURE': False,
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SAMESITE': 'Lax',
}

# MAIL

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'sandbox.smtp.mailtrap.io'
EMAIL_PORT = os.getenv('EMAIL_PORT', 2525)
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", '183c7aef5afc10')
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", '7b49b74b51cbce')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_TIMEOUT = 5

## MJML
MJML_BACKEND_MODE = 'httpserver'
MJML_HTTPSERVERS = [
    {
        'URL': 'https://api.mjml.io/v1/render',  # official MJML API
        'HTTP_AUTH': (os.getenv('MJML_APP_ID'), os.getenv('MJML_APP_KEY')),
    },
    {
        'URL': os.getenv('MJML_OWN_SERVER_URL', 'http://localhost:15500/v1/render'),  # your own HTTP-server
    },
]

# FIXTURES

FIXTURE_DIRS = (
    BASE_DIR / 'stuff',
    BASE_DIR / 'store',
)

# messages

MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'

# SITE ID

if DEBUG:
    SITE_NAME = 'http://localhost:8113'
elif UNSTABLE:
    SITE_NAME = 'https://77.238.243.142'
elif PRODUCTION:
    SITE_NAME = 'https://89.104.68.172'

# REST FRAMEWORK API KEY
CORS_ALLOWED_HEADERS = (
    "Content-Type",
    "Accept",
    "Authorization",
    "X-CSRF-Token",
    "X-Requested-With",
    "X-Api-Key",
)

# WHITENOISE
