"""
Users URLs configuration.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# from . import views

router = DefaultRouter()
# To be implemented
# router.register(r'profiles', views.UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
