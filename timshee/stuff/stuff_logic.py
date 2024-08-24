import secrets

from django.contrib.auth import get_user_model
from rest_framework_simplejwt import tokens
from auxiliaries.auxiliaries_methods import get_logger
from . import models

User = get_user_model()
logger = get_logger(__name__)


def get_token_for_user(user):
    token = tokens.RefreshToken.for_user(user)
    return {
        'refresh': str(token),
        'access': str(token.access_token)
    }


def generate_verification_token(rq, data):
    try:
        user = User.objects.filter(email=data['email'])
        if user.exists():
            return 1, {'error': 'user exists'}

        token = secrets.token_hex(128)
        email_token = models.EmailToken.objects.create(
            uuid=token,
            for_email=data.get('email'),
            user=rq.user,
        )
        return 0, {'token': email_token.uuid}
    except Exception as e:
        logger.error(e, exc_info=True)
        return 2, None

