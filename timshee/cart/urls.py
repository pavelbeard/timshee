from django.urls import path

from . import views

urlpatterns = [
    path("carts/", views.CartListCreateAPIView.as_view(), name="cart-create"),
    path("carts/<int:pk>/", views.CartRetrieveUpdateDestroyAPIView.as_view(), name="cart-detail"),
    path("items/", views.CartItemListCreateAPIView.as_view(), name="cart-item-create"),
    path("items/<int:pk>/", views.CartItemRetrieveUpdateDestroyAPIView.as_view(), name="cart-item-detail"),
]
