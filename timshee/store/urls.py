from . import views

from django.urls import path


urlpatterns = (
    path("items/", views.ItemListCreateAPIView.as_view(), name="item-list-create"),
    path("items/<int:pk>/", views.ItemRetrieveUpdateDestroyAPIView.as_view(), name="item-detail"),
    path("categories/", views.CategoryListCreateAPIView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name="category-detail"),
    path("collections/", views.CollectionListCreateAPIView.as_view(), name="collection-list-create"),
    path("collections/<int:pk>/", views.CollectionRetrieveUpdateDestroyAPIView.as_view(), name="collection-detail"),
)
