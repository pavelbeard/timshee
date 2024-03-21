from . import views

from django.urls import path


urlpatterns = (
    path("store/items/", views.ItemListCreateAPIView.as_view(), name="item-list-create"),
    path("store/items/<int:pk>/", views.ItemRetrieveUpdateDestroyAPIView.as_view(), name="item-detail"),
    path("store/categories/", views.CategoryListCreateAPIView.as_view(), name="category-list-create"),
    path("store/categories/<int:pk>/", views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name="category-detail"),
    path("store/collections/", views.CollectionListCreateAPIView.as_view(), name="collection-list-create"),
    path("store/collections/<int:pk>/", views.CollectionRetrieveUpdateDestroyAPIView.as_view(), name="collection-detail"),
    # test
    path("store/hello/", views.Test.as_view(), name="hello"),
)
