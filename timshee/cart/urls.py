from django.urls import path

from . import views

urlpatterns = [
    path("cart/", views.CartAPIView.as_view(), name="cart")
]