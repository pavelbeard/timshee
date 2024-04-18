from . import views

from django.urls import path


urlpatterns = (
    path("items/", views.ItemListCreateAPIView.as_view(), name="item-list-create"),
    path("items/<int:pk>/", views.ItemRetrieveUpdateDestroyAPIView.as_view(), name="item-detail"),
    path("round_images/", views.RoundImageListCreateAPIView.as_view(), name="round-image-list-create"),
    path("round_images/<int:pk>", views.RoundImageRetrieveDestroyAPIView.as_view(), name="round-image-detail"),
    path("logos/", views.LogoListCreateAPIView.as_view(), name="logo-list-create"),
    path("logos/<int:pk>", views.LogoRetrieveDestroyAPIView.as_view(), name="logo-detail"),
    path("types/", views.TypeListCreateAPIView.as_view(), name="type-list-create"),
    path("types/<int:pk>/", views.TypeRetrieveDestroyAPIView.as_view(), name="type-detail"),
    path("sizes/", views.SizeListCreateAPIView.as_view(), name="size-list-create"),
    path("sizes/<int:pk>/", views.SizeRetrieveDestroyAPIView.as_view(), name="size-detail"),
    path("categories/", views.CategoryListCreateAPIView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", views.CategoryRetrieveUpdateDestroyAPIView.as_view(), name="category-detail"),
    path("collections/", views.CollectionListCreateAPIView.as_view(), name="collection-list-create"),
    path("collections/<int:pk>/", views.CollectionRetrieveUpdateDestroyAPIView.as_view(), name="collection-detail"),
)
