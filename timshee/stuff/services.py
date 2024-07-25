from ipaddress import IPv4Address, IPv6Address

import dns
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


def send_email(request):
    current_site = get_current_site(request)

    if settings.DEBUG:
        logo_url = f"http://{current_site.domain}{static('static/stuff/static/img/img.png')}"
    else:
        logo_url = f"https://{current_site.domain}{static('static/stuff/static/img/img.png')}"

    html_message = request.data.get('html_message').replace(
        '-SITE_URL-', settings.CLIENT_REDIRECT
    ).replace('-IMAGE_SRC-', logo_url)

    subject = request.data.get('subject')
    if request.user.is_authenticated:
        to = request.user.email
    else:
        to = request.data.get('to')

    # is_valid = validate_email(
    #     email_address=to,
    #     check_format=True,
    #     check_blacklist=True,
    #     check_dns=True,
    #     dns_timeout=10,
    #     check_smtp=True,
    #     smtp_timeout=10,
    #     # smtp_helo_host='my.host.name',
    #     # smtp_from_address='my@from.addr.ess',
    #     smtp_skip_tls=False,
    #     smtp_tls_context=None,
    #     smtp_debug=False,
    #     address_types=frozenset([IPv4Address, IPv6Address])
    # )
    #
    # if not is_valid:
    #     return 0

    email = EmailMessage(subject, html_message, to=[to])
    email.content_subtype = 'html'
    return email.send()
