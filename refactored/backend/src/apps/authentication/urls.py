"""
Authentication URLs.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views

from . import views

router = DefaultRouter()
router.register(r'auth', views.AuthViewSet, basename='auth')
router.register(r'profile', views.ProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('token/refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
    path('settings/', views.SettingsAPIView.as_view(), name='settings'),
]
