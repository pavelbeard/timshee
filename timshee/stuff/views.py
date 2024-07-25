import logging

from django.conf import settings
from django.contrib.auth import get_user_model, models, authenticate
from django.contrib.sessions.models import Session
from django.db import IntegrityError
from django.http import JsonResponse
from django.middleware import csrf
from django.utils import timezone
from django.utils.translation import activate
from order import models as order_models
from order import serializers as order_serializers
from rest_framework import generics, status, permissions, viewsets
from rest_framework import views
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from store import models as store_models

from . import models, services, serializers

# Create your views here.
User = get_user_model()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_token_for_user(user):
    token = tokens.RefreshToken.for_user(user)
    return {
        'refresh': str(token),
        'access': str(token.access_token)
    }


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

            session_key = request.COOKIES.get('sessionid')

            orders = order_models.Order.objects.filter(session_key=session_key)
            wishlist_objs = store_models.Wishlist.objects.filter(session_key=session_key)

            if orders.exists():
                orders.update(user=instance)

            if wishlist_objs.exists():
                wishlist_objs.update(user=instance)

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
            username = self.request.data['username']
            password = self.request.data['password']

            if username and password:
                user = authenticate(username=username, password=password)

                if isinstance(user, User):
                    session_key = self.request.COOKIES.get('sessionid')
                    order_models.Order.objects.filter(session_key=session_key).update(user=user)
                    store_models.Wishlist.objects.filter(session_key=session_key).update(user=user)
                    _tokens = get_token_for_user(user)

                    response = Response(status=status.HTTP_200_OK)
                    response.set_cookie(
                        key=settings.SIMPLE_JWT['AUTH_ACCESS_COOKIE'],
                        value=_tokens['access'],
                        max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly=False,
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
            session_id = request.COOKIES.get('sessionid')
            Session.objects.filter(session_key=session_id).delete()

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
                httponly=False,
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

            del response.data['access']
            del response.data['refresh']

        response['X-CSRFToken'] = request.COOKIES.get('csrftoken')
        return super().finalize_response(request, response, *args, **kwargs)


class EmailViewSet(viewsets.ModelViewSet):
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

    @action(detail=False, methods=["PUT"])
    def change_email(self, request):
        if self.request.user.is_authenticated:
            user = self.request.user
            try:
                user.email = request.data.strip()
                user.username = request.data.strip()
                user.save()

                return Response({'email': user.email}, status=status.HTTP_200_OK)
            except IntegrityError:
                return Response({"error": "email already exists"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def check_email(self, request):
        try:
            if not request.data.get('email'):
                return Response(status=status.HTTP_400_BAD_REQUEST)

            email = request.data.get('email').strip()
            user = User.objects.get(email=email)
            if user:
                recent_cases = models.ResetPasswordCases.objects.filter(user=user)

                if recent_cases.exists():
                    recent_cases.update(is_active=False)

                instance = models.ResetPasswordCases.objects.create(
                    user=user,
                )
                return Response({'uuid': instance.uuid}, status=status.HTTP_200_OK)
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
            reset_password_case = models.ResetPasswordCases.objects.filter(uuid=uuid, is_active=True).first()

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

            recent_case = models.ResetPasswordCases.objects.filter(uuid=uuid).first()

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

    @action(detail=False, methods=["POST"], permission_classes=[permissions.AllowAny], authentication_classes=[])
    def send_email(self, request):
        result = services.send_email(request)

        if result == 1:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ChangeLanguageAPIView(generics.GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = []

    def get(self, request):
        try:
            if self.request.user.is_authenticated:
                lang = self.request.user.userprofile.preferred_language
            else:
                lang = self.request.session.get(settings.LANGUAGE_COOKIE_NAME, "en-US")
            return JsonResponse({"language": lang}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(e, exc_info=True)
            return JsonResponse(data={}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            language_code = self.request.data.get('language')
            if language_code and language_code.split('-')[0] in dict(settings.LANGUAGES).keys():
                self.request.session[settings.LANGUAGE_COOKIE_NAME] = language_code.split('-')[0]
                activate(language_code.split('-')[0])

                if request.user.is_authenticated:
                    user = self.request.user
                    user.userprofile.preferred_language = language_code.split('-')[0]
                    user.userprofile.save()

            return JsonResponse({"language": language_code}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(e, exc_info=True)
            return JsonResponse(data={}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetDynSettingsAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    allowed_methods = ["GET"]

    def get(self, request):
        dyn_settings = models.DynamicSettings.objects.get(pk=1)
        return JsonResponse({
            "onContentUpdate": dyn_settings.on_content_update,
            "onMaintenance": dyn_settings.on_maintenance,
        }, status=status.HTTP_200_OK)
