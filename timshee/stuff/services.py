from ipaddress import IPv4Address, IPv6Address

import dns
from rest_framework import serializers
from validate_email import validate_email
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage
from django.templatetags.static import static

try:
    from . import resolver
except:
    pass


def check_email_domain(email):
    domain = email.split('@')[1]
    try:
        records = dns.resolver.resolve(domain, 'MX')
        return True
    except dns.resolver.NoAnswer:
        return False
    except dns.resolver.NXDOMAIN:
        return False
    except dns.resolver.Timeout:
        return False
    except Exception as e:
        return False


class EmailDataSerializer(serializers.Serializer):
    html_message = serializers.CharField()
    subject = serializers.CharField()
    to = serializers.EmailField()


def send_email(request):
    serializer = EmailDataSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    current_site = get_current_site(request)

    if settings.DEBUG:
        logo_url = f"http://{current_site.domain}{static('static/stuff/static/img/img.png')}"
    else:
        logo_url = f"https://{current_site.domain}{static('static/stuff/static/img/img.png')}"

    html_message = (data.get('html_message')
                    .replace('-SITE_URL-', settings.CLIENT_REDIRECT)
                    .replace('-IMAGE_SRC-', logo_url))

    subject = data.get('subject')
    if request.user.is_authenticated:
        to = request.user.email
    else:
        to = data.get('to')
    email = EmailMessage(subject, html_message, to=[to])
    email.content_subtype = 'html'
    return email.send()
