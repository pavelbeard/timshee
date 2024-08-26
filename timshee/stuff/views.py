from gettext import translation

from django.conf import settings
from django.contrib.auth import get_user_model, models, authenticate
from django.db import IntegrityError
from django.http import JsonResponse
from django.middleware import csrf
from django.utils import timezone
from django.utils.translation import activate, get_language_info, gettext as _, get_language
from rest_framework import generics, status, permissions, viewsets
from rest_framework import views
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.response import Response
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from order import models as order_models
from store import models as store_models
from cart import models as cart_models
from order import serializers as order_serializers
from auxiliaries.auxiliaries_methods import get_logger

from . import models, services, serializers, stuff_logic

# Create your views here.
User = get_user_model()

logger = get_logger(__name__)


class SignupAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    allowed_methods = ["post"]
    serializer_class = serializers.SignupSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            instance = serializer.save()

            if not instance:
                return AuthenticationFailed('Failed to create user.')

            response = Response(status=status.HTTP_201_CREATED)
            response.data = {'detail': 'User created'}
            response['X-CSRFToken'] = csrf.get_token(request)

            return response
        except IntegrityError:
            return AuthenticationFailed('User already exists.')
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SigninAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    allowed_methods = ["post"]
    serializer_class = serializers.SigninSerializer

    def post(self, request, *args, **kwargs):
        try:
            username = str(self.request.data['username']).strip()
            password = str(self.request.data['password']).strip()

            if username and password:
                user = authenticate(email=username, password=password)

                if isinstance(user, ValidationError) or user is None:
                    return Response(status=status.HTTP_404_NOT_FOUND)

                if isinstance(user, User):
                    session_key = self.request.COOKIES.get('sessionid')
                    cart_models.Cart.objects.filter(session__session_key=session_key).update(user=user)
                    order_models.Order.objects.filter(session__session_key=session_key).update(user=user)
                    store_models.Wishlist.objects.filter(session__session_key=session_key).update(user=user)
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
                    response.data = {'access': _tokens['access'], 'user': user.email}
                    response['X-CSRFToken'] = csrf.get_token(request)
                    return response

                response = Response(status=status.HTTP_400_BAD_REQUEST)
                response.data = {'error': 'Invalid credentials.'}
                return response
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SignoutAPIView(views.APIView):
    allowed_methods = ["post"]

    def post(self, request):
        try:
            refresh = request.COOKIES.get('refresh_token')

            token = tokens.RefreshToken(refresh)
            token.blacklist()
            response = Response()
            response.delete_cookie(key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'])
            response.delete_cookie(key=settings.SIMPLE_JWT['AUTH_REFRESH_COOKIE'])
            response.delete_cookie(key='csrftoken')
            response.delete_cookie(key='X-CSRFToken')
            response['X-CSRFToken'] = None
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

        response['X-CSRFToken'] = request.COOKIES.get('csrftoken')
        return super().finalize_response(request, response, *args, **kwargs)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = order_serializers.UserSerializer
    allowed_methods = ["GET", "get_email"]
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["GET"])
    def get_email(self, request, *args, **kwargs):
        if self.request.user.is_authenticated:
            user = self.request.user
            return Response({"email": user.email}, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.IsAuthenticated])
    def generate_verification_token(self, request, *args, **kwargs):
        serializer = serializers.EmailVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        result, data = stuff_logic.generate_verification_token(request, serializer.validated_data)
        if result == 1:
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        elif result == 2:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data, status=status.HTTP_200_OK)


    @action(
        detail=False,
        methods=["PUT"],
        permission_classes=[permissions.IsAuthenticated],
        authentication_classes=[JWTAuthentication]
    )
    def change_email(self, request):
        user = self.request.user
        try:
            serializer = serializers.EmailTokenSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data

            email_token = models.EmailToken.objects.filter(uuid=data['token']).first()
            if not email_token:
                return Response(status=status.HTTP_400_BAD_REQUEST)

            expired = (timezone.now() > email_token.until)
            if expired:
                email_token.is_active = False
                email_token.save()
                return Response({'error': 'token has expired'}, status=status.HTTP_400_BAD_REQUEST)

            user.email = email_token.for_email
            user.save()

            return Response(status=status.HTTP_200_OK)
        except IntegrityError:
            return Response({"error": "email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception:
            logger.exception(msg='Something went wrong...', exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def check_email(self, request):
        try:
            if not request.data.get('email'):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            email = request.data.get('email').strip()
            user = User.objects.get(email=email)
            if user:
                recent_cases = models.ResetPasswordCase.objects.filter(user=user)

                if recent_cases.exists():
                    recent_cases.update(is_active=False)

                instance = models.ResetPasswordCase.objects.create(
                    user=user,
                )
                return Response({'token': instance.uuid}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def is_reset_password_request_valid(self, request):
        try:
            if not request.data.get('uuid'):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            uuid = request.data.get('uuid').strip()
            reset_password_case = models.ResetPasswordCase.objects.filter(uuid=uuid, is_active=True).first()

            if not reset_password_case:
                return Response(status=status.HTTP_404_NOT_FOUND)

            expired = (timezone.now() > reset_password_case.until)
            if expired:
                reset_password_case.is_active = False
                reset_password_case.save()
                return Response(status=status.HTTP_400_BAD_REQUEST)

            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def change_password(self, request):
        try:
            if not request.data.get('uuid'):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            uuid = request.data.get('uuid').strip()

            password1 = request.data.get('password1')
            password2 = request.data.get('password2')

            if password1 != password2:
                return Response({"detail": "Passwords don't match."}, status=status.HTTP_400_BAD_REQUEST)

            recent_case = models.ResetPasswordCase.objects.filter(uuid=uuid).first()

            if not recent_case:
                return Response(status=status.HTTP_404_NOT_FOUND)

            user = recent_case.user
            user.set_password(password1)
            user.save()

            recent_case.is_active = False
            recent_case.save()

            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetSettingsAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    allowed_methods = ["GET"]

    def get(self, request):
        dyn_settings = models.DynamicSettings.objects.filter(pk=1).first()
        session = None
        if not request.COOKIES.get('sessionid'):
            session = request.session.create()

        if not dyn_settings:
            return Response(status=status.HTTP_404_NOT_FOUND)
        response = JsonResponse({
            "onContentUpdate": dyn_settings.on_content_update,
            "onMaintenance": dyn_settings.on_maintenance,
            "experimental": dyn_settings.experimental,
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


class EmailViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []

    @action(detail=False, methods=["POST"])
    def send_email(self, request):
        try:
            result = services.send_email(request)

            if result == 1:
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, exception=e)


class LanguageViewSet(viewsets.ViewSet):
    authentication_classes = []
    permission_classes = []

    @action(detail=False, methods=["GET"])
    def get_languages(self, request):
        lang_dict = [{'language': language, 'translation': translation_} for language, translation_ in settings.LANGUAGES]
        print(lang_dict, get_language())
        return Response(data=lang_dict, status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_current_language(self, request):
        if request.user.is_authenticated:
            lang = User.objects.get(id=request.user.id).userprofile.preferred_language
        elif request.COOKIES.get('server_language') is None:
            lang = settings.LANGUAGE_CODE
        else:
            lang = request.COOKIES.get('server_language')

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