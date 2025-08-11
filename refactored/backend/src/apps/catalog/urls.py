"""
Catalog URLs.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
# To be implemented
# router.register(r'products', views.ProductViewSet)
# router.register(r'categories', views.CategoryViewSet)
# router.register(r'collections', views.CollectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
