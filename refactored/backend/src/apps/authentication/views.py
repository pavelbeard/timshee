"""
Authentication views.
"""

from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth import get_user_model
from django.utils.translation import activate

from .models import UserProfile, DynamicSettings
from .serializers import (
    UserSerializer, 
    UserProfileSerializer, 
    LoginSerializer,
    PasswordChangeSerializer,
    DynamicSettingsSerializer
)
from src.api.base import BaseViewSet

User = get_user_model()


class AuthViewSet(viewsets.ViewSet):
    """
    Authentication ViewSet handling login, logout, registration.
    """
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        """User registration."""
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """User login."""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            response = Response({
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
            
            # Set refresh token as HTTP-only cookie
            response.set_cookie(
                'refresh_token',
                str(refresh),
                max_age=60 * 60 * 24 * 7,  # 7 days
                httponly=True,
                secure=True,
                samesite='Lax'
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """User logout."""
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
            response.delete_cookie('refresh_token')
            return response
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class CookieTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view that uses HTTP-only cookies.
    """
    
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            request.data['refresh'] = refresh_token
        return super().post(request, *args, **kwargs)


class ProfileViewSet(BaseViewSet):
    """
    User profile management ViewSet.
    """
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter to current user's profile only."""
        return self.queryset.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user's profile."""
        try:
            profile = UserProfile.objects.get(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=request.user)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def change_password(self, request):
        """Change user password."""
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'Password changed successfully'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def change_language(self, request):
        """Change user's preferred language."""
        language = request.data.get('language')
        if language in ['en', 'es', 'ru']:
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            profile.preferred_language = language
            profile.save()
            activate(language)
            return Response({'message': 'Language changed successfully'})
        return Response({'error': 'Invalid language'}, status=status.HTTP_400_BAD_REQUEST)


class SettingsAPIView(generics.RetrieveAPIView):
    """
    Get dynamic application settings.
    """
    permission_classes = [AllowAny]
    serializer_class = DynamicSettingsSerializer
    
    def get_object(self):
        return DynamicSettings.get_instance()
    
    def get(self, request, *args, **kwargs):
        """Get settings and create session if needed."""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        response = Response(serializer.data)
        
        # Create session if doesn't exist
        if not request.COOKIES.get('sessionid'):
            request.session.create()
            response.set_cookie(
                key='sessionid',
                value=request.session.session_key,
                max_age=60 * 60 * 24 * 30,  # 30 days
                secure=False,  # Set to True in production
                httponly=True,
                samesite='Lax',
            )
        
        return response
