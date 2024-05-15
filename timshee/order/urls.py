from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()

router.register(r'countries', views.CountryViewSet)
router.register(r'phone-codes', views.CountryPhoneCodeViewSet)
router.register(r'provinces', views.ProvinceViewSet)
router.register(r'addresses', views.AddressViewSet)
router.register(r'orders', views.OrderViewSet)
router.register(r'anon-addresses', views.AnonymousAddressViewSet)
router.register(r'anon-orders', views.AnonymousOrderViewSet)

urlpatterns = [
    path("check-pending-for-payment/", views.CheckPendingForPay.as_view(), name="check-pending-for-payment"),
    path("", include(router.urls))
]
