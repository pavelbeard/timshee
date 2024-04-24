from django.urls import path

from . import views

urlpatterns = [
    path('get-csrf-token/', views.GetCsrfToken.as_view(), name='csrf'),
    path('register/', views.RegisterAPIView.as_view(), name='register'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('check-auth/', views.CheckAuthenticatedAPIView.as_view(), name='check-auth'),
]
