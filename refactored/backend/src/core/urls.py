"""
Main URL configuration for Timshee e-commerce platform.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# API versioning
api_v1_patterns = [
    path('auth/', include('src.apps.authentication.urls')),
    path('catalog/', include('src.apps.catalog.urls')),
    path('shopping/', include('src.apps.shopping.urls')),
    path('orders/', include('src.apps.orders.urls')),
    path('payments/', include('src.apps.payments.urls')),
    path('users/', include('src.apps.users.urls')),
    path('notifications/', include('src.apps.notifications.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_patterns)),
    path('api/', include(api_v1_patterns)),  # Default to v1
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
