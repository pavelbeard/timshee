from django.urls import path

from . import views

urlpatterns = [
    path("create-payment/", views.PaymentAPIView.as_view(), name="payment"),
]
