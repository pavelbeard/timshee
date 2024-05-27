from django.urls import path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'email', views.EmailViewSet)

urlpatterns = [
    path('get-csrf-token/', views.GetCsrfToken.as_view(), name='csrf'),
    path('register/', views.RegisterAPIView.as_view(), name='register'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('check-auth/', views.CheckAuthenticatedAPIView.as_view(), name='check-auth'),
]

urlpatterns += router.urls
