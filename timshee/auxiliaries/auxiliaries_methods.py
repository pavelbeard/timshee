import logging
from datetime import timedelta, datetime
from smtplib import SMTPServerDisconnected

from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.templatetags.static import static
from django.utils.html import strip_tags


def get_logger(__name__):
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    return logger

def get_logo_url(current_site):
    if settings.DEBUG:
        return f"http://{current_site}{static('static/stuff/static/img/img.png')}"
    else:
        return f"https://{current_site}{static('static/stuff/static/img/img.png')}"


def send_email(subject, template, to, context, rq=None, current_site=None):
    curr_site = current_site if rq is None else get_current_site(rq).domain
    logo_url = get_logo_url(curr_site)
    context = {
        'logo_url': logo_url,
        'subject': subject,
        **context
    }

    html_message = render_to_string(template, context)
    plain_message = strip_tags(html_message)
    try:
        return send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[to],
            html_message=html_message,
        )
    except SMTPServerDisconnected as e:
        logger = get_logger(__name__)
        logger.error(e, exc_info=True)
        return 1

def get_until_time(hours=1):
    return datetime.now() + timedelta(hours=hours)