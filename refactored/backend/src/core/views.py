"""
Core views and mixins for the Timshee application.
"""

from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend


class BaseViewSet(viewsets.ModelViewSet):
    """
    A base viewset that provides default filtering, searching, and ordering.
    """
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    ordering = ['-created_at']  # Default ordering by creation date
    
    def get_queryset(self):
        """
        Optionally restricts the returned objects by filtering against
        the query parameters in the URL.
        """
        queryset = super().get_queryset()
        
        # Add any common filtering logic here
        if hasattr(self.request.user, 'is_authenticated') and self.request.user.is_authenticated:
            # Add user-specific filtering if needed
            pass
            
        return queryset
