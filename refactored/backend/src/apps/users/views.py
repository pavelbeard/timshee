"""
Users views for managing user profiles.
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Placeholder views - to be implemented
class UserProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing user profiles.
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return []  # Placeholder
    
    def get_serializer_class(self):
        return None  # Placeholder
