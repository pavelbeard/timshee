from django.conf import settings
from django.contrib.auth import get_user_model, models, authenticate
from django.db import IntegrityError
from django.http import JsonResponse
from django.middleware import csrf
from django.utils import timezone
from django.utils.translation import activate
from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView

from auxiliaries.auxiliaries_methods import get_logger
from order import serializers as order_serializers
from . import models, serializers, stuff_logic

# Create your views here.
User = get_user_model()

logger = get_logger(__name__)


def set_csrfmiddlewaretoken(rq, rs):
    rs.set_cookie(
        key='csrfmiddlewaretoken',
        value=csrf.get_token(rq),
        httponly=True,
        samesite='Lax',

    )
    return rs


class AuthViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []

    @action(detail=False, methods=['POST'])
    def sign_up(self, request):
        try:
            serializer = serializers.SignupSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()

            if not instance:
                return AuthenticationFailed('Failed to create user.')

            response = Response(status=status.HTTP_201_CREATED)
            response = set_csrfmiddlewaretoken(rq=request, rs=response)
            response.data = {'detail': 'User created'}

            return response
        except IntegrityError:
            return AuthenticationFailed('User already exists.')
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'])
    def sign_in(self, request, *args, **kwargs):
        try:
            print(request.data)
            serializer = serializers.SigninSerializer(data=request.data)
            # username = str(self.request.data['username']).strip()
            # password = str(self.request.data['password']).strip()
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            username = data['username']
            password = data['password']

            if username and password:
                user = authenticate(request=request, email=username, password=password)

                if isinstance(user, ValidationError) or user is None:
                    return Response(status=status.HTTP_404_NOT_FOUND)

                if isinstance(user, User):
                    _tokens = stuff_logic.get_token_for_user(user)

                    response = Response(status=status.HTTP_200_OK)
                    response.set_cookie(
                        key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'],
                        value=_tokens['access'],
                        max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                    )
                    response.set_cookie(
                        key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'],
                        value=_tokens['refresh'],
                        max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                    )
                    response = set_csrfmiddlewaretoken(rq=request, rs=response)
                    response.data = {'access': _tokens['access'], 'user': user.email}
                    return response

                response = Response(status=status.HTTP_400_BAD_REQUEST)
                response.data = {'error': 'Invalid credentials.'}
                return response
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        detail=False,
        methods=['POST'],
        authentication_classes=[JWTAuthentication],
        permission_classes=[permissions.IsAuthenticated]
    )
    def sign_out(self, request):
        try:
            refresh = request.COOKIES.get('refresh_token')

            token = tokens.RefreshToken(refresh)
            token.blacklist()
            response = Response()
            response.delete_cookie(key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'])
            response.delete_cookie(key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'])
            response.delete_cookie(key='csrfmiddlewaretoken')
            response.delete_cookie(key='X-CSRFToken')
            response.data = {"detail": "You're logged out!"}
            response.status = status.HTTP_200_OK
            return response
        except TokenError:
            logger.exception('Token is blacklisted', exc_info=True)
            return Response({'error': 'Token is blacklisted'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception:
            logger.exception('Unexpected error', exc_info=True)
            return Response({'error': 'Unexpected error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = serializers.CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'],
                value=response.data['access'],
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'],
                value=response.data['refresh'],
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            )

            refresh = response.data['refresh']
            user = User.objects.get(id=tokens.RefreshToken(refresh)['user_id'])
            response.data['user'] = user.email
            del response.data['refresh']


        return super().finalize_response(request, response, *args, **kwargs)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = order_serializers.UserSerializer
    authentication_classes = [JWTAuthentication]

    @action(detail=False, methods=['GET'])
    def get_email_confirmation_status(self, request):
        result = stuff_logic.get_email_confirm_status(request)
        return Response({'confirmed': result}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.IsAuthenticated])
    def generate_verification_token(self, request, *args, **kwargs):
        serializer = serializers.EmailVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = stuff_logic.generate_verification_token(request, serializer.validated_data)
        if result == 2:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)


    @action(
        detail=False,
        methods=["PUT"],
        permission_classes=[permissions.IsAuthenticated],
        authentication_classes=[JWTAuthentication]
    )
    def change_email(self, request):
        try:
            serializer = serializers.EmailTokenSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data
            email_token = models.EmailToken.objects.filter(uuid=data['token']).first()
            if not email_token:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            user = email_token.user

            expired = (timezone.now() > email_token.until)
            if expired:
                email_token.is_active = False
                email_token.save()
                return Response({'error': 'token has expired'}, status=status.HTTP_400_BAD_REQUEST)

            user.email = email_token.for_email
            user.userprofile.email_confirmed = True
            user.userprofile.save()
            user.save()

            return Response(status=status.HTTP_200_OK)
        except IntegrityError:
            return Response({"error": "email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logger.exception(msg='Something went wrong...', exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(
        detail=False,
        methods=["POST"],
        permission_classes=[permissions.AllowAny],
        authentication_classes=[]
    )
    def check_email(self, request):
        result, error = stuff_logic.check_email(request)
        if result == 2:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if result == 3:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if result == 4:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["POST"],
        permission_classes=[permissions.AllowAny],
        authentication_classes=[]
    )
    def is_reset_password_request_valid(self, request):
        result, error = stuff_logic.is_reset_password_request_valid(request)
        if result == 1:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        elif result == 2:
            return Response(error, status=status.HTTP_404_NOT_FOUND)
        elif result == 3:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)

    @action(
        detail=False, methods=["POST"],
        permission_classes=[permissions.AllowAny],
        authentication_classes=[]
    )
    def change_password(self, request):
        result, error = stuff_logic.change_password(request)
        if result == 2:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        elif result == 3:
            return Response(error, status=status.HTTP_404_NOT_FOUND)
        elif result == 4:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)


class GetSettingsAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = [IsAuthenticatedOrReadOnly]
    allowed_methods = ["GET"]

    def get(self, request):
        dyn_settings = models.DynamicSettings.objects.first()
        session = None
        if not request.COOKIES.get('sessionid'):
            session = request.session.create()

        if not dyn_settings:
            return Response(status=status.HTTP_404_NOT_FOUND)

        response = JsonResponse({
            "onContentUpdate": dyn_settings.on_content_update,
            "onMaintenance": dyn_settings.on_maintenance,
            "experimental": dyn_settings.experimental,
            "international": dyn_settings.international,
        }, status=status.HTTP_200_OK)
        if session:
            response.set_cookie(
                key='sessionid',
                value=session.session_key,
                max_age=settings.SESSION_COOKIE_AGE,
                secure=settings.SESSION_COOKIE_SECURE,
                httponly=settings.SESSION_COOKIE_HTTPONLY,
                samesite=settings.SESSION_COOKIE_SAMESITE,
            )
        return response


class LanguageViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []

    @action(detail=False, methods=["GET"])
    def get_languages(self, request):
        lang_dict = [{'language': language, 'translation': translation_} for language, translation_ in settings.LANGUAGES]
        return Response(data=lang_dict, status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_current_language(self, request):
        dyn_settings: models.DynamicSettings = models.DynamicSettings.objects.first()
        if request.user.is_authenticated:
            lang = User.objects.get(id=request.user.id).userprofile.preferred_language
        elif request.COOKIES.get('server_language') is None:
            if dyn_settings and dyn_settings.international:
                lang = settings.LANGUAGE_CODE
            else:
                lang = 'ru'
        else:
            if dyn_settings and dyn_settings.international:
                lang = request.COOKIES.get('server_language')
            else:
                lang = 'ru'

        response = Response()
        response.set_cookie(
            key=settings.LANGUAGE_COOKIE_NAME,
            value=lang,
        )
        response.status_code = status.HTTP_200_OK
        return response

    @action(detail=False, methods=["POST"])
    def change_language(self, request):
        lang = request.data.get('lang')

        if not lang:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:
            user_profile = User.objects.get(id=request.user.id).userprofile
            user_profile.preferred_language = lang
            user_profile.save()

        activate(lang)
        response = Response()
        response.set_cookie(
            key=settings.LANGUAGE_COOKIE_NAME,
            value=lang,
        )
        response.status_code = status.HTTP_200_OK
        return response