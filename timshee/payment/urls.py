from django.urls import path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'payment-manage', views.PaymentViewSet)

urlpatterns = router.urls
