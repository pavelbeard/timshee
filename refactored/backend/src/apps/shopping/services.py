"""
Shopping service layer for business logic.
"""

from django.db import transaction
from django.contrib.sessions.models import Session
from django.contrib.auth import get_user_model

from .models import Cart, CartItem
from src.apps.catalog.models import ProductVariant
from src.utils.helpers import get_user_or_session

User = get_user_model()


class CartService:
    """
    Service class for cart operations.
    """
    
    @staticmethod
    def get_or_create_cart(request):
        """
        Get or create cart for current user/session.
        """
        user, session = get_user_or_session(request)
        
        if user:
            cart, created = Cart.objects.get_or_create(
                user=user,
                session=None,
                is_active=True
            )
        elif session:
            cart, created = Cart.objects.get_or_create(
                user=None,
                session=session,
                is_active=True
            )
        else:
            # Create new session if none exists
            request.session.create()
            session = Session.objects.get(session_key=request.session.session_key)
            cart, created = Cart.objects.get_or_create(
                user=None,
                session=session,
                is_active=True
            )
        
        return cart

    @staticmethod
    @transaction.atomic
    def add_to_cart(request, variant_id, quantity=1):
        """
        Add item to cart or update quantity if exists.
        """
        try:
            variant = ProductVariant.objects.get(id=variant_id, is_active=True)
        except ProductVariant.DoesNotExist:
            raise ValueError("Product variant not found or inactive")
        
        if not variant.is_in_stock:
            raise ValueError("Product variant is out of stock")
        
        if quantity > variant.stock_quantity:
            raise ValueError(f"Only {variant.stock_quantity} items available")
        
        cart = CartService.get_or_create_cart(request)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            defaults={'quantity': quantity}
        )
        
        if not created:
            new_quantity = cart_item.quantity + quantity
            if new_quantity > variant.stock_quantity:
                raise ValueError(f"Cannot add {quantity} more items. Only {variant.stock_quantity - cart_item.quantity} available")
            cart_item.quantity = new_quantity
            cart_item.save()
        
        return cart_item

    @staticmethod
    def update_cart_item(request, variant_id, quantity):
        """
        Update cart item quantity.
        """
        cart = CartService.get_or_create_cart(request)
        
        try:
            cart_item = CartItem.objects.get(cart=cart, variant_id=variant_id)
            variant = cart_item.variant
            
            if quantity <= 0:
                cart_item.delete()
                return None
            
            if quantity > variant.stock_quantity:
                raise ValueError(f"Only {variant.stock_quantity} items available")
            
            cart_item.quantity = quantity
            cart_item.save()
            return cart_item
            
        except CartItem.DoesNotExist:
            raise ValueError("Cart item not found")

    @staticmethod
    def remove_from_cart(request, variant_id):
        """
        Remove item from cart.
        """
        cart = CartService.get_or_create_cart(request)
        
        try:
            cart_item = CartItem.objects.get(cart=cart, variant_id=variant_id)
            cart_item.delete()
            return True
        except CartItem.DoesNotExist:
            return False

    @staticmethod
    def clear_cart(request):
        """
        Clear all items from cart.
        """
        cart = CartService.get_or_create_cart(request)
        cart.clear()
        return True

    @staticmethod
    def merge_carts(user, session):
        """
        Merge session cart with user cart when user logs in.
        """
        try:
            session_cart = Cart.objects.get(session=session, user=None, is_active=True)
        except Cart.DoesNotExist:
            return  # No session cart to merge
        
        user_cart, created = Cart.objects.get_or_create(
            user=user,
            session=None,
            is_active=True
        )
        
        # Merge items from session cart to user cart
        for session_item in session_cart.items.all():
            user_item, created = CartItem.objects.get_or_create(
                cart=user_cart,
                variant=session_item.variant,
                defaults={'quantity': session_item.quantity}
            )
            
            if not created:
                # Update quantity, respecting stock limits
                new_quantity = min(
                    user_item.quantity + session_item.quantity,
                    session_item.variant.stock_quantity
                )
                user_item.quantity = new_quantity
                user_item.save()
        
        # Delete session cart
        session_cart.delete()
