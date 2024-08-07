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

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "change_me")

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = bool(int(os.getenv("DJANGO_SETTINGS_DEBUG_MODE", 1)))
TESTING = bool(int(os.getenv("DJANGO_SETTINGS_TESTING_MODE", 0)))

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
    # 'oauth2_provider',
    # 'social_django',
    # 'drf_social_oauth2',
    'colorfield',
    'django_filters',
    # "debug_toolbar" if (DEBUG or TESTING) else "",
    "parler",
    "parler_rest",
    # my
    "store.apps.StoreConfig",
    "cart.apps.CartConfig",
    "order.apps.OrderConfig",
    "stuff.apps.StuffConfig",
    "payment.apps.PaymentConfig",
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
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
    # my
    'stuff.middleware.LanguageMiddleware'
]

if DEBUG or TESTING:
    INTERNAL_IPS = [
        "localhost",
        "127.0.0.1",
    ]

ROOT_URLCONF = 'timshee.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'stuff'
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
            'NAME': BASE_DIR / 'db.sqlite3.new',
        },
        'secondary': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'test_timshee_db',
            'USER': 'test_timshee',
            'PASSWORD': 'admin@123',
            'HOST': 'localhost',
            'PORT': 5432,
        }
    }
elif TESTING or not DEBUG:
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

LANGUAGE_CODE = 'ru-ru'

TIME_ZONE = 'Europe/Moscow'

USE_I18N = True

USE_TZ = True

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
    MEDIA_URL = "timshee/media/"
else:
    MEDIA_URL = "/backend/media/"

if DEBUG or TESTING:
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
else:
    CSRF_TRUSTED_ORIGINS = re.split(r",|\s", os.getenv("ALLOWED_ORIGINS", ""))
    CORS_ALLOWED_ORIGINS = re.split(r",|\s", os.getenv("ALLOWED_ORIGINS", ""))

CORS_ALLOWED_METHODS = ["GET", "POST", "PUT", "OPTIONS", "DELETE"]
CORS_ALLOW_CREDENTIALS = True

# settings.py

# AUTH_USER_MODEL = 'stuff.UUIDUser'

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE__X_FORWARDED_PROTO = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'PAGE_SIZE': 9,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}

AUTHENTICATION_BACKENDS = (
    # 'drf_social_oauth2.backends.DjangoOAuth2',
    'django.contrib.auth.backends.ModelBackend',
    'stuff.authentication.EmailAuthenticationBackend',
    # custom
    # 'social_core.backends.google.GoogleOAuth2',
)

# SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY")
# SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET")
#
# SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
#     'https://www.googleapis.com/auth/userinfo.email',
#     'https://www.googleapis.com/auth/userinfo.profile',
# ]

CART_SESSION_ID = "cart"

SESSION_COOKIE_AGE = 60 * 60 * 24

ACCOUNT_ID = os.getenv("ACCOUNT_ID")
API_KEY = os.getenv("SECRET_KEY")
CLIENT_REDIRECT = os.getenv("CLIENT_REDIRECT", "http://localhost:3000/")

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
    'AUTH_COOKIE_SECURE': True,
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SAMESITE': 'Lax',
}

# MAIL

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# LANGUAGE

LANGUAGE_COOKIE_NAME = 'server_language'
LANGUAGE_COOKIE_AGE = 60 * 60 * 24 * 30

LANGUAGES = (
    ('en', _('English')),
    ('fr', _('French')),
    ('it', _('Italian')),
    ('gr', _('Greek')),
    ('de', _('Deutch')),
    ('es', _('Spanish')),
    ('ru', _('Russian')),
)

# PARLER

PARLER_LANGUAGES = {
    None: (
        {'code': 'en', },
        {'code': 'es', },
        {'code': 'fr', },
        {'code': 'it', },
        {'code': 'ru', },
    ),
    'default': {
        'fallbacks': ['en'],
        'hide_untranslated': False,
    }
}

# FIXTURES

FIXTURE_DIRS = (
    BASE_DIR / 'stuff',
    BASE_DIR / 'store',
)

# messages

MESSAGE_STORAGE = 'django.contrib.messages.storage.session.SessionStorage'
