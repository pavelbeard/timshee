from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.DefaultRouter()
router.register(r'profile', views.ProfileViewSet)

urlpatterns = [
    path('signin/', views.SigninAPIView.as_view(), name='signin'),
    path('signup/', views.SignupAPIView.as_view(), name='signup'),
    path('signout/', views.SignoutAPIView.as_view(), name='signout'),
    path('token/refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
    path('lang/', views.ChangeLanguageAPIView.as_view(), name='lang'),
    path('settings/', views.GetSettingsAPIView.as_view(), name='get-dyn-settings'),
]

urlpatterns += router.urls
