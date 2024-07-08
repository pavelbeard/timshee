import logging

from django.conf import settings
from django.contrib.auth import get_user_model, models
from django.db import IntegrityError
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.utils.translation import activate
from django.views.decorators.csrf import csrf_protect
from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt import tokens
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from . import models, services

from order import models as order_models
from order import serializers as order_serializers
from store import models as store_models

# Create your views here.
User = get_user_model()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GetCsrfToken(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["get"]

    def get(self, request):
        get_token(request)
        return JsonResponse({'detail': "CSRF token has set successfully"},
                            safe=False, status=status.HTTP_200_OK)


@method_decorator(csrf_protect, name='dispatch')
class RegisterAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    allowed_methods = ["post"]

    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')
            first_name = request.data.get('firstName')
            last_name = request.data.get('lastName')
            session_key = request.session.session_key

            if User.objects.filter(email=email).exists():
                return JsonResponse({'detail': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            user.save()

            orders = order_models.Order.objects.filter(session_key=session_key)
            wishlist_objs = store_models.Wishlist.objects.filter(session_key=session_key)

            if orders.exists():
                orders.update(user=user)

            if wishlist_objs.exists():
                wishlist_objs.update(user=user)

            token = tokens.RefreshToken.for_user(user)
            response = JsonResponse({
                "refresh": str(token),
                "access": str(token.access_token),
            }, status=status.HTTP_201_CREATED)
            response.set_cookie('refresh', str(token), httponly=True)

            return response
        except Exception as e:
            logger.error(e, exc_info=True)
            return JsonResponse(data={}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_protect, name='dispatch')
class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == status.HTTP_200_OK:
                session_key = request.session.session_key
                user = User.objects.get(email=request.data['username'])
                order_models.Order.objects.filter(session_key=session_key).update(user=user)
                store_models.Wishlist.objects.filter(session_key=session_key).update(user=user)
                token = tokens.RefreshToken.for_user(user)
                response.set_cookie('refresh', str(token), httponly=True)

            return response
        except Exception as e:
            logger.error(e, exc_info=True)
            return JsonResponse(data={}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
                user.email = request.data['email'].strip()
                user.username = request.data['email'].strip()
                user.save()

                return Response({"detail": "email has been changed"}, status=status.HTTP_200_OK)
            except IntegrityError:
                return Response({"detail": "email already exists"}, status=status.HTTP_400_BAD_REQUEST)
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
                services.send_email_reset_password(request, instance.uuid, email)
                return Response(status=status.HTTP_200_OK)
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

            if not (password1 == password2):
                return Response({"detail": "Passwords don't match."}, status=status.HTTP_400_BAD_REQUEST)

            recent_case = models.ResetPasswordCases.objects.filter(uuid=uuid).first()

            if not recent_case:
                return Response(status=status.HTTP_404_NOT_FOUND)

            user = recent_case.user
            user.set_password(password1)
            user.save()

            recent_case.is_active = False
            recent_case.save()

            services.send_email_reset_password_success(request, user.email)

            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(e, exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


class TestAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        from . import services
        status_ = services.send_test_email(request, 3, 'processing')
        return JsonResponse({"test": status_}, status=status.HTTP_200_OK)


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
