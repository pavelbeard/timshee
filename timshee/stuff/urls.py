from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.DefaultRouter()
router.register(r'profile', views.ProfileViewSet)
router.register(r'email', views.EmailViewSet, basename='email')
router.register(r'lang', views.LanguageViewSet, basename='lang')
router.register(r'auth', views.AuthViewSet, basename='auth')

urlpatterns = [
    path('token/refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
    path('settings/', views.GetSettingsAPIView.as_view(), name='get-dyn-settings'),
]

urlpatterns += router.urls
