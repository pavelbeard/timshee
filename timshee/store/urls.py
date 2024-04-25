from . import views

from django.urls import path


urlpatterns = (
    path("items/", views.ItemListCreateAPIView.as_view(), name="item-list-create"),
    path("items/<int:pk>/", views.ItemRetrieveUpdateDestroyAPIView.as_view(), name="item-detail"),
    path("round-images/", views.StockImageListCreateAPIView.as_view(), name="round-image-list-create"),
    path("round-images/<int:pk>/", views.StockImageRetrieveDestroyAPIView.as_view(), name="round-image-detail"),
    path("types/", views.TypeListCreateAPIView.as_view(), name="type-list-create"),
    path("types/<int:pk>/", views.TypeRetrieveDestroyAPIView.as_view(), name="type-detail"),
    path("sizes/", views.SizeListCreateAPIView.as_view(), name="size-list-create"),
    path("sizes/<int:pk>/", views.SizeRetrieveDestroyAPIView.as_view(), name="size-detail"),
    path("colors/", views.ColorListCreateAPIView.as_view(), name="color-list-create"),
    path("colors/<int:pk>/", views.ColorRetrieveDestroyAPIView.as_view(), name="color-detail"),
    path("categories/", views.CategoryListCreateAPIView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name="category-detail"),
    path("collections/", views.CollectionListCreateAPIView.as_view(), name="collection-list-create"),
    path("collections/<int:pk>/", views.CollectionRetrieveUpdateDestroyAPIView.as_view(), name="collection-detail"),
)
