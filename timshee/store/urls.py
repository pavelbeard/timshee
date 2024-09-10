from rest_framework import routers

from . import views


router = routers.DefaultRouter()
router.register(r'items', views.ItemViewSet)
router.register(r'stock-images', views.StockImageViewSet)
router.register(r'types', views.TypeViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'collections', views.CollectionViewSet)
router.register(r'colors', views.ColorViewSet)
router.register(r'sizes', views.SizeViewSet)
router.register(r'stocks', views.StockViewSet)
router.register(r'wishlist', views.WishlistViewSet)


urlpatterns = router.urls
