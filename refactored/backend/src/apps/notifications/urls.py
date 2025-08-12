"""
Notifications URLs configuration.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# from . import views

router = DefaultRouter()
# To be implemented
# router.register(r'notifications', views.NotificationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
