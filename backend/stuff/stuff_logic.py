import secrets

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt import tokens

from auxiliaries.auxiliaries_methods import get_logger, send_email, get_until_time
from . import models
from .models import UserProfile

User = get_user_model()
logger = get_logger(__name__)


def get_token_for_user(user):
    token = tokens.RefreshToken.for_user(user)
    return {
        'refresh': str(token),
        'access': str(token.access_token)
    }

def get_email_confirm_status(rq):
    user = rq.user
    try:
        confirmation = user.userprofile.email_confirmed
    except User.userprofile.RelatedObjectDoesNotExist:
        UserProfile.objects.create(user=user, email_confirmed=False)
        confirmation = user.userprofile.email_confirmed
    return confirmation

def generate_verification_token(rq, data):
    try:
        user = User.objects.filter(email=data['email']).first()
        token = secrets.token_hex(128)
        email_token = models.EmailToken.objects.filter(user=user).first()
        if not email_token:
            email_token = models.EmailToken.objects.create(
                uuid=token,
                for_email=data.get('email'),
                user=user,
            )

        email_token.token = token
        email_token.until = get_until_time(hours=1)
        email_token.save()

        subject = _('Email confirmation.')
        confirm_link = f"{settings.CLIENT_REDIRECT}account/confirm-email?token={email_token.uuid}"
        context = {
            'confirm_link': confirm_link,
            'text': _('Confirm your email by the link below 👇'),
            'confirm_link_text': _('Go to the email confirmation'),
        }
        result = send_email(
            rq=rq,
            subject=subject,
            to=email_token.for_email,
            template='templates/stuff_mjml/templates/confirm_email.mjml',
            context=context,
        )
        return result
    except Exception as e:
        logger.error(e, exc_info=True)
        return 2

def check_email(rq):
    try:
        email = rq.data.get('email')
        if not email:
            return 2, None

        email = email.strip()
        user = User.objects.filter(username=email).first()
        if not user:
            return 3, None

        recent_cases = models.ResetPasswordCase.objects.filter(user=user)

        if recent_cases.exists():
            recent_cases.update(is_active=False)

        instance = models.ResetPasswordCase.objects.create(
            user=user,
        )

        context = {
            'text': {
                'p1': _('Follow the link below to set a new password 👇'),
                'p2': _('The link is valid for 1 hour!'),
            },
            'reset_link': f"{settings.CLIENT_REDIRECT}account/password/reset?token={instance.uuid}",
            'reset_link_text': _('Go to set a new password!'),
        }

        return send_email(
            rq=rq,
            subject=_('Change password.'),
            to=email,
            template='templates/stuff_mjml/templates/change_password.mjml',
            context=context
        ), None
    except Exception as e:
        return 4, e

def is_reset_password_request_valid(rq):
    try:
        if not rq.data.get('token'):
            return 1, {'error': 'token is absent.'}

        uuid = rq.data.get('token').strip()
        reset_password_case = models.ResetPasswordCase.objects.filter(uuid=uuid, is_active=True).first()
        if not reset_password_case:
            return 2, {'error': 'link is invalid.'}

        expired = (timezone.now() > reset_password_case.until)
        if expired:
            reset_password_case.is_active = False
            reset_password_case.save()
            return 2, {'error': 'token has expired.'}

        return 0, None
    except Exception as e:
        logger.error(e, exc_info=True)
        return 1, None

def change_password(rq):
    try:
        if not rq.data.get('token'):
            return 2, {'error': 'token is required.'}

        token = rq.data.get('token').strip()

        password1 = rq.data.get('password1').strip()
        password2 = rq.data.get('password2').strip()

        if password1 != password2:
            return 2, {'error': "passwords don't match."}

        recent_case = models.ResetPasswordCase.objects.filter(uuid=token).first()

        if not recent_case:
            return 3, {'error': 'token does not exist.'}

        user = recent_case.user
        user.set_password(password1)
        user.save()

        recent_case.is_active = False
        recent_case.save()

        context = {
            'text': {
                'p1': _('Password has been changed successfully!'),
                'p2': _("If it wasn't you, please, write us to support"),
            }
        }

        result = send_email(
            rq=rq,
            subject=_('Reset password.'),
            to=recent_case.user.email,
            template='templates/stuff_mjml/templates/change_password_success.mjml',
            context=context
        )

        return result, None
    except Exception as e:
        logger.error(e, exc_info=True)
        return 4, None

