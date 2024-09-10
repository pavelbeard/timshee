from django.urls import path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('cart-items', views.CartViewSet, basename='cart')

urlpatterns = router.urls
