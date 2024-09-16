from django.conf import settings
from rest_framework import permissions
from rest_framework_api_key import permissions as api_key_permissions


class HasAPIKey(permissions.BasePermission):
    def has_permission(self, request, view):
        if settings.UNSTABLE:
            print(request.headers)
        if request.headers.get('X-Api-Key') == settings.SECRET_KEY:
            return True

        if api_key_permissions.HasAPIKey().has_permission(request=request, view=view):
            return True

        return False