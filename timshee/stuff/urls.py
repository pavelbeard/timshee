from django.urls import path
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views

from . import views

router = routers.DefaultRouter()
router.register(r'email', views.EmailViewSet)

urlpatterns = [
    path('token/', views.LoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('get-csrf-token/', views.GetCsrfToken.as_view(), name='csrf'),
    path('register/', views.RegisterAPIView.as_view(), name='register'),
    path('lang/', views.ChangeLanguageAPIView.as_view(), name='lang'),
]

urlpatterns += router.urls
