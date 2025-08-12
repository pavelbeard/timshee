"""
Notifications views for managing user notifications.
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Placeholder views - to be implemented
class NotificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing notifications.
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return []  # Placeholder
    
    def get_serializer_class(self):
        return None  # Placeholder
