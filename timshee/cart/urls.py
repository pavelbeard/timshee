from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('', views.CartItemViewSet, basename='cart-items')

urlpatterns = [
    path("carts/", views.CartListCreateAPIView.as_view(), name="cart-create"),
    path("carts/<int:pk>/", views.CartRetrieveUpdateDestroyAPIView.as_view(), name="cart-detail"),
    path("items/", views.CartItemListCreateAPIView.as_view(), name="cart-item-create"),
    path("items/<int:pk>/", views.CartItemRetrieveUpdateDestroyAPIView.as_view(), name="cart-item-detail"),
    path('cart-items/', include(router.urls)),
]
