"""
Payments views for handling payment processing.
"""

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Placeholder views - to be implemented
class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing payments.
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return []  # Placeholder
    
    def get_serializer_class(self):
        return None  # Placeholder
