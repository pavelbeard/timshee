from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('cart-items', views.CartItemViewSet)
router.register('carts', views.CartViewSet)
router.register('anon-cart-items', views.AnonymousCartItemViewSet)
router.register('anon-carts', views.AnonymousCartViewSet)

urlpatterns = router.urls
