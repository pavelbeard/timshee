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