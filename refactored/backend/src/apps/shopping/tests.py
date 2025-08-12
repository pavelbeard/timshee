"""
Unit tests for the shopping application.
"""

from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase, APIClient

from src.apps.catalog.models import Collection, Category, ProductType, Product, ProductVariant, Size, Color
from src.apps.shopping.models import Cart, CartItem


class CartModelTest(TestCase):
    """Test cases for Cart model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create catalog objects for testing
        self.collection = Collection.objects.create(
            name='Test Collection',
            description='Test collection'
        )
        self.category = Category.objects.create(
            name='Test Category',
            code='test-category'
        )
        self.product_type = ProductType.objects.create(
            name='Test Type',
            category=self.category
        )
        self.size = Size.objects.create(value='M')
        self.color = Color.objects.create(
            name='Blue',
            hex='#0000FF'
        )
        
        # Create a simple test image
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82',
            content_type='image/jpeg'
        )
        
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            collection=self.collection,
            product_type=self.product_type,
            base_price=Decimal('19.99'),
            main_image=test_image
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            size=self.size,
            color=self.color,
            sku='TEST-SKU-001',
            stock_quantity=10
        )

    def test_cart_creation(self):
        """Test creating a cart."""
        cart = Cart.objects.create(user=self.user)
        self.assertEqual(cart.user, self.user)
        self.assertIsNotNone(cart.created_at)

    def test_cart_str_representation(self):
        """Test string representation of cart."""
        cart = Cart.objects.create(user=self.user)
        expected = f"Cart - {self.user.username}"
        self.assertEqual(str(cart), expected)


class CartItemModelTest(TestCase):
    """Test cases for CartItem model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create catalog objects for testing
        self.collection = Collection.objects.create(
            name='Test Collection',
            description='Test collection'
        )
        self.category = Category.objects.create(
            name='Test Category',
            code='test-category'
        )
        self.product_type = ProductType.objects.create(
            name='Test Type',
            category=self.category
        )
        self.size = Size.objects.create(value='M')
        self.color = Color.objects.create(
            name='Blue',
            hex='#0000FF'
        )
        
        # Create a simple test image
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82',
            content_type='image/jpeg'
        )
        
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            collection=self.collection,
            product_type=self.product_type,
            base_price=Decimal('19.99'),
            main_image=test_image
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            size=self.size,
            color=self.color,
            sku='TEST-SKU-001',
            stock_quantity=10
        )
        self.cart = Cart.objects.create(user=self.user)

    def test_cart_item_creation(self):
        """Test creating a cart item."""
        cart_item = CartItem.objects.create(
            cart=self.cart,
            variant=self.variant,
            quantity=2
        )
        self.assertEqual(cart_item.cart, self.cart)
        self.assertEqual(cart_item.variant, self.variant)
        self.assertEqual(cart_item.quantity, 2)

    def test_cart_item_str_representation(self):
        """Test string representation of cart item."""
        cart_item = CartItem.objects.create(
            cart=self.cart,
            variant=self.variant,
            quantity=2
        )
        expected = f"{self.variant} x {cart_item.quantity}"
        self.assertEqual(str(cart_item), expected)

    def test_cart_item_total_price(self):
        """Test cart item total price calculation."""
        cart_item = CartItem.objects.create(
            cart=self.cart,
            variant=self.variant,
            quantity=3
        )
        expected_total = self.product.base_price * cart_item.quantity
        self.assertEqual(cart_item.subtotal, expected_total)
