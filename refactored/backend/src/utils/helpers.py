"""
Shared utilities for the Timshee application.
"""

import logging
import uuid

from django.contrib.sessions.models import Session
from django.contrib.auth import get_user_model

User = get_user_model()


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance with consistent formatting.
    
    Args:
        name: Logger name (usually __name__)
        
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)
    return logger


def generate_short_uuid() -> str:
    """
    Generate a short UUID for use in models.
    
    Returns:
        Short UUID string
    """
    return str(uuid.uuid4())[:8]


def get_user_or_session(request):
    """
    Get user or session from request for anonymous user handling.
    
    Args:
        request: Django request object
        
    Returns:
        Tuple of (user, session) where one will be None
    """
    if request.user.is_authenticated:
        return request.user, None
    
    session_key = request.session.session_key
    if session_key:
        try:
            session = Session.objects.get(session_key=session_key)
            return None, session
        except Session.DoesNotExist:
            pass
    
    return None, None


class SingletonMixin:
    """
    Mixin to create singleton model instances.
    """
    
    @classmethod
    def get_instance(cls):
        """Get or create the singleton instance."""
        instance, created = cls.objects.get_or_create(pk=1)
        return instance
    
    def save(self, *args, **kwargs):
        """Override save to ensure only one instance exists."""
        self.pk = 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        """Prevent deletion of singleton instance."""
        pass
