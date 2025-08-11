"""
Core middleware for the Timshee application.
"""

from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.utils.deprecation import MiddlewareMixin

User = get_user_model()


class AuthSubstitutionMiddleware(MiddlewareMixin):
    """
    Middleware to handle authentication substitution and cart merging.
    """
    
    def process_request(self, request):
        if not request.user.is_authenticated:
            session_key = request.session.session_key
            if session_key:
                try:
                    session = Session.objects.get(session_key=session_key)
                    request.session_obj = session
                except Session.DoesNotExist:
                    pass
        else:
            # Handle cart merging when user logs in
            if request.session.get('just_logged_in'):
                from src.apps.shopping.services import CartService
                session_key = request.session.session_key
                if session_key:
                    try:
                        session = Session.objects.get(session_key=session_key)
                        CartService.merge_carts(request.user, session)
                    except Session.DoesNotExist:
                        pass
                
                # Clear the flag
                del request.session['just_logged_in']
        
        return None
