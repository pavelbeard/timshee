from django.urls import path

from . import views

urlpatterns = [
    path("cart/carts/", views.CartListCreateAPIView.as_view(), name="cart-create"),
    path("cart/carts/<int:pk>/", views.CartRetrieveUpdateDestroyAPIView.as_view(), name="cart-detail"),
    path("cart/items/", views.CartItemListCreateAPIView.as_view(), name="cart-item-create"),
    path("cart/items/<int:pk>/", views.CartItemRetrieveUpdateDestroyAPIView.as_view(), name="cart-item-detail"),
]
