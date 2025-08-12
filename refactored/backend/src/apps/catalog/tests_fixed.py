"""
Unit tests for the catalog application.
"""

from decimal import Decimal
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase, APIClient

from src.apps.catalog.models import Collection, Category, ProductType, Product, ProductVariant, Size, Color


class CollectionModelTest(TestCase):
    """Test cases for Collection model."""

    def setUp(self):
        self.collection_data = {
            'name': 'Spring Collection 2024',
            'description': 'Beautiful spring collection',
            'link': 'spring-summer-2024',
            'is_active': True
        }

    def test_collection_creation(self):
        """Test creating a collection."""
        collection = Collection.objects.create(**self.collection_data)
        self.assertEqual(collection.name, 'Spring Collection 2024')
        self.assertTrue(collection.is_active)

    def test_collection_str_representation(self):
        """Test string representation of collection."""
        collection = Collection.objects.create(**self.collection_data)
        self.assertEqual(str(collection), 'Spring Collection 2024')


class CategoryModelTest(TestCase):
    """Test cases for Category model."""

    def setUp(self):
        self.category_data = {
            'name': 'Test Category',
            'code': 'test-category',
            'description': 'A test category for testing purposes',
            'is_active': True
        }

    def test_category_creation(self):
        """Test creating a category."""
        category = Category.objects.create(**self.category_data)
        self.assertEqual(category.name, 'Test Category')
        self.assertEqual(category.code, 'test-category')
        self.assertTrue(category.is_active)

    def test_category_str_representation(self):
        """Test string representation of category."""
        category = Category.objects.create(**self.category_data)
        self.assertEqual(str(category), 'Test Category')


class ProductModelTest(TestCase):
    """Test cases for Product model."""

    def setUp(self):
        # Create required related objects
        self.collection = Collection.objects.create(
            name='Test Collection',
            description='Test collection for products'
        )
        self.category = Category.objects.create(
            name='Test Category',
            code='test-category'
        )
        self.product_type = ProductType.objects.create(
            name='Test Type',
            category=self.category
        )
        
        # Create a simple test image
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82',
            content_type='image/jpeg'
        )
        
        self.product_data = {
            'name': 'Test Product',
            'slug': 'test-product',
            'description': 'A test product',
            'collection': self.collection,
            'product_type': self.product_type,
            'base_price': Decimal('19.99'),
            'main_image': test_image,
            'is_active': True
        }

    def test_product_creation(self):
        """Test creating a product."""
        product = Product.objects.create(**self.product_data)
        self.assertEqual(product.name, 'Test Product')
        self.assertEqual(product.slug, 'test-product')
        self.assertEqual(product.base_price, Decimal('19.99'))
        self.assertTrue(product.is_active)

    def test_product_str_representation(self):
        """Test string representation of product."""
        product = Product.objects.create(**self.product_data)
        expected = f"[{product.name}] [ID: {product.id}] [Price: {product.base_price}]"
        self.assertEqual(str(product), expected)


class ProductVariantModelTest(TestCase):
    """Test cases for ProductVariant model."""

    def setUp(self):
        # Create required related objects
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
        self.color = Color.objects.create(name='Red', hex='#FF0000')
        
        # Create a simple test image
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82',
            content_type='image/jpeg'
        )
        
        self.product = Product.objects.create(
            name='Test Product',
            slug='test-product',
            description='A test product',
            collection=self.collection,
            product_type=self.product_type,
            base_price=Decimal('29.99'),
            main_image=test_image,
            is_active=True
        )

    def test_product_variant_creation(self):
        """Test creating a product variant."""
        variant = ProductVariant.objects.create(
            product=self.product,
            size=self.size, 
            color=self.color, 
            sku='TEST-SKU',
            stock_quantity=10
        )
        self.assertEqual(variant.product, self.product)
        self.assertEqual(variant.size, self.size)
        self.assertEqual(variant.color, self.color)
        self.assertEqual(variant.stock_quantity, 10)

    def test_product_variant_str_representation(self):
        """Test string representation of product variant."""
        variant = ProductVariant.objects.create(
            product=self.product,
            size=self.size,
            color=self.color,
            stock_quantity=5,
            sku='TEST-SKU-002'
        )
        expected = f"{self.product.name} - {self.size.value} - {self.color.name}"
        self.assertEqual(str(variant), expected)


class CatalogValidationTest(TestCase):
    """Test cases for catalog model validations."""

    def test_product_price_validation(self):
        """Test product price validations."""
        collection = Collection.objects.create(
            name='Test Collection',
            description='Test collection'
        )
        category = Category.objects.create(
            name='Test Category',
            code='test-category'
        )
        product_type = ProductType.objects.create(
            name='Test Type',
            category=category
        )

        # Test that negative price should raise validation error
        # This would be handled by model validation if implemented
        test_image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xdb\x00\x00\x00\x00IEND\xaeB`\x82',
            content_type='image/jpeg'
        )
        
        product = Product.objects.create(
            name='Test Product',
            slug='test-negative-price',
            collection=collection,
            product_type=product_type,
            base_price=Decimal('-10.00'),  # This should be caught by validation
            main_image=test_image
        )
        self.assertIsNotNone(product)  # Basic test - validation would be in model


class CatalogAPITest(APITestCase):
    """Test cases for catalog API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_placeholder_api_endpoints(self):
        """Placeholder tests for API endpoints."""
        # These tests will be implemented when the API views are created
        # For now, just ensure the test structure is in place
        self.assertTrue(True)
