from django.contrib.auth import get_user_model, authenticate, models
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from order import serializers as order_serializers
from order import models as order_models
from rest_framework import generics, status, permissions, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt import views as jwt_views, tokens
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

from . import services


# Create your views here.


class GetCsrfToken(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    allowed_methods = ["get"]

    def get(self, request):
        get_token(request)
        return JsonResponse({'detail': "CSRF token has set successfully"},
                            safe=False, status=status.HTTP_200_OK)


User = get_user_model()


@method_decorator(csrf_protect, name='dispatch')
class RegisterAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    allowed_methods = ["post"]

    def post(self, request):
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

        order_models.Order.objects.filter(session_key=session_key).update(user=user)

        token = tokens.RefreshToken.for_user(user)
        return JsonResponse({
            "refresh": str(token),
            "access": str(token.access_token),
        }, status=status.HTTP_201_CREATED)


@method_decorator(csrf_protect, name='dispatch')
class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            session_key = request.session.session_key
            user = User.objects.get(email=request.data['username'])
            order_models.Order.objects.filter(session_key=session_key).update(user=user)

        return response


@method_decorator(csrf_protect, name='dispatch')
class LogoutAPIView(generics.GenericAPIView):
    allowed_methods = ["post"]

    def post(self, request):
        request.user.auth_token.delete()
        return JsonResponse({'status': 'logged out'}, safe=False, status=status.HTTP_200_OK)


class CheckAuthenticatedAPIView(generics.GenericAPIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    allowed_methods = ["GET"]

    def handle_exception(self, exc):
        if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
            return JsonResponse(
                {
                    "authenticated": False, "error": "Not authenticated",
                }
                , status=status.HTTP_200_OK)
        return super().handle_exception(exc)

    def get(self, request):
        user_id = request.user.id
        return JsonResponse({'authenticated': True, 'user': user_id, 'user_name': request.user.email},
                            safe=False,
                            status=status.HTTP_200_OK)


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
