from django.urls import path
from . import views

urlpatterns = [
    path("countries/", views.CountryListCreateAPIView.as_view(), name="country-create"),
    path("countries/<int:pk>/", views.CountryListCreateAPIView.as_view(), name="country-detail"),
    path("cities/", views.CityListCreateAPIView.as_view(), name="city-create"),
    path("cities/<int:pk>/", views.CityRetrieveUpdateDestroyAPIView.as_view(), name="city-detail"),
    path("addresses/", views.AddressListCreateAPIView.as_view(), name="address-create"),
    path("addresses/<int:pk>/", views.AddressRetrieveUpdateDestroyAPIView.as_view(), name="address-detail"),
    path("orders/", views.OrderListCreateAPIView.as_view(), name="order-create"),
    path("orders/<int:pk>/", views.OrderRetrieveUpdateDestroyAPIView.as_view(), name="order-detail"),
]