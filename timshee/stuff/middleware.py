from django.conf import settings
from django.utils import translation
from django.utils.deprecation import MiddlewareMixin


class LanguageMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated:
            lang = request.user.userprofile.preferred_language
        else:
            lang = translation.get_language_from_request(request)

        translation.activate(lang)
        request.LANGUAGE_CODE = lang

class AuthSubstitutionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.COOKIES.get('access_token', None):
            request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + request.COOKIES['access_token']
            request.headers.__dict__.update({'Authorization': 'Bearer ' + request.COOKIES['access_token']})
        if request.COOKIES.get('csrfmiddlewaretoken', None):
            request.META['HTTP_X_CSRFTOKEN'] = request.COOKIES['csrfmiddlewaretoken']
