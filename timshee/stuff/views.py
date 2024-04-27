from django.contrib.auth import get_user_model, authenticate
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework import generics, status, serializers, permissions

from auxiliaries.auxiliaries_methods import generate_random_symbols
from rest_framework.permissions import IsAuthenticated


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
        token, created = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': token.key}, status=status.HTTP_201_CREATED)


@method_decorator(csrf_protect, name='dispatch')
class LoginAPIView(generics.GenericAPIView):
    authentication_classes = []
    permission_classes = []
    allowed_methods = ["post"]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(username=email, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': token.key}, safe=False, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'Credentials are worst'},
                                safe=False, status=status.HTTP_401_UNAUTHORIZED)


@method_decorator(csrf_protect, name='dispatch')
class LogoutAPIView(generics.GenericAPIView):
    allowed_methods = ["post"]

    def post(self, request):
        request.user.auth_token.delete()
        return JsonResponse({'status': 'Logged out'}, safe=False, status=status.HTTP_200_OK)


class CheckAuthenticatedAPIView(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]
    allowed_methods = ["get"]

    def get(self, request):
        user_id = request.user.id
        return JsonResponse({'status': 'Authenticated', 'user': user_id},
                            safe=False,
                            status=status.HTTP_200_OK)
