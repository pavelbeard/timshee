"""
Common API utilities and base classes.
"""

from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination

from src.utils.helpers import get_user_or_session


class StandardResultsSetPagination(PageNumberPagination):
    """
    Standard pagination class for consistent API responses.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class BaseViewSet(viewsets.ModelViewSet):
    """
    Base ViewSet with common functionality.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    pagination_class = StandardResultsSetPagination
    
    def get_user_or_session(self):
        """Helper method to get user or session from request."""
        return get_user_or_session(self.request)
    
    def handle_exception(self, exc):
        """Custom exception handling."""
        response = super().handle_exception(exc)
        if hasattr(response, 'data') and isinstance(response.data, dict):
            response.data = {
                'error': True,
                'message': response.data.get('detail', str(exc)),
                'data': None
            }
        return response


class UserSessionViewSetMixin:
    """
    Mixin for ViewSets that handle user/session-based filtering.
    """
    
    def filter_by_user_or_session(self, queryset):
        """Filter queryset by current user or session."""
        user, session = get_user_or_session(self.request)
        
        if user:
            return queryset.filter(user=user)
        elif session:
            return queryset.filter(session=session)
        
        return queryset.none()
    
    def get_queryset(self):
        """Override to filter by user or session."""
        queryset = super().get_queryset()
        return self.filter_by_user_or_session(queryset)
