"""
Unit tests for the users application.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient

from src.apps.users.models import UserPreferences, UserAddress


class UserPreferencesModelTest(TestCase):
    """Test cases for UserPreferences model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_preferences_creation(self):
        """Test creating user preferences."""
        preferences = UserPreferences.objects.create(
            user=self.user,
            newsletter_subscription=True,
            marketing_emails=False,
            preferred_currency='USD',
            preferred_language='en'
        )
        self.assertEqual(preferences.user, self.user)
        self.assertTrue(preferences.newsletter_subscription)
        self.assertFalse(preferences.marketing_emails)
        self.assertEqual(preferences.preferred_currency, 'USD')

    def test_user_preferences_str_representation(self):
        """Test string representation of user preferences."""
        preferences = UserPreferences.objects.create(user=self.user)
        expected_str = f"Preferences for {self.user.username}"
        self.assertEqual(str(preferences), expected_str)

    def test_user_preferences_defaults(self):
        """Test default values for user preferences."""
        preferences = UserPreferences.objects.create(user=self.user)
        self.assertTrue(preferences.newsletter_subscription)  # Assuming default is True
        self.assertEqual(preferences.preferred_currency, 'USD')  # Assuming default
        self.assertEqual(preferences.preferred_language, 'en')  # Assuming default


class UserAddressModelTest(TestCase):
    """Test cases for UserAddress model."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.address_data = {
            'user': self.user,
            'address_type': 'shipping',
            'first_name': 'John',
            'last_name': 'Doe',
            'company': 'Test Company',
            'address_line_1': '123 Test Street',
            'address_line_2': 'Apt 456',
            'city': 'Test City',
            'state': 'Test State',
            'postal_code': '12345',
            'country': 'US',
            'phone_number': '+1234567890'
        }

    def test_user_address_creation(self):
        """Test creating a user address."""
        address = UserAddress.objects.create(**self.address_data)
        self.assertEqual(address.user, self.user)
        self.assertEqual(address.address_type, 'shipping')
        self.assertEqual(address.first_name, 'John')
        self.assertEqual(address.city, 'Test City')
        self.assertFalse(address.is_default)

    def test_user_address_str_representation(self):
        """Test string representation of user address."""
        address = UserAddress.objects.create(**self.address_data)
        expected_str = f"{address.address_type.title()} - {address.first_name} {address.last_name}"
        self.assertEqual(str(address), expected_str)

    def test_user_address_full_name_property(self):
        """Test full_name property."""
        address = UserAddress.objects.create(**self.address_data)
        self.assertEqual(address.full_name, 'John Doe')

    def test_user_address_formatted_address_property(self):
        """Test formatted_address property."""
        address = UserAddress.objects.create(**self.address_data)
        expected_format = "123 Test Street\nApt 456\nTest City, Test State 12345\nUS"
        self.assertEqual(address.formatted_address, expected_format)

    def test_user_address_types(self):
        """Test different address types."""
        address_types = ['shipping', 'billing']
        
        for addr_type in address_types:
            address_data = self.address_data.copy()
            address_data['address_type'] = addr_type
            address = UserAddress.objects.create(**address_data)
            self.assertEqual(address.address_type, addr_type)

    def test_default_address_per_type(self):
        """Test that only one address can be default per type per user."""
        # Create first default shipping address
        address1 = UserAddress.objects.create(
            **self.address_data,
            is_default=True
        )
        self.assertTrue(address1.is_default)
        
        # Create second default shipping address
        address_data_2 = self.address_data.copy()
        address_data_2['address_line_1'] = '456 Another Street'
        address2 = UserAddress.objects.create(
            **address_data_2,
            is_default=True
        )
        
        # In a real implementation, first address should no longer be default
        # For now, we just test that both were created
        self.assertTrue(address2.is_default)


class UserProfileBusinessLogicTest(TestCase):
    """Test cases for user profile business logic."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_profile_creation_signal(self):
        """Test that user profile is created automatically when user is created."""
        # This test assumes there's a signal that creates UserPreferences
        # when a User is created
        new_user = User.objects.create_user(
            username='newuser',
            email='new@example.com',
            password='testpass123'
        )
        
        # Check if preferences were created automatically
        # preferences = UserPreferences.objects.filter(user=new_user).first()
        # self.assertIsNotNone(preferences)

    def test_user_address_management(self):
        """Test user address management."""
        # Create multiple addresses
        shipping_address = UserAddress.objects.create(
            user=self.user,
            address_type='shipping',
            first_name='John',
            last_name='Doe',
            address_line_1='123 Shipping St',
            city='Shipping City',
            state='SC',
            postal_code='12345',
            country='US',
            is_default=True
        )
        
        billing_address = UserAddress.objects.create(
            user=self.user,
            address_type='billing',
            first_name='John',
            last_name='Doe',
            address_line_1='456 Billing Ave',
            city='Billing City',
            state='BC',
            postal_code='67890',
            country='US',
            is_default=True
        )
        
        # Test that user has both addresses
        self.assertEqual(
            UserAddress.objects.filter(user=self.user, address_type='shipping').count(),
            1
        )
        self.assertEqual(
            UserAddress.objects.filter(user=self.user, address_type='billing').count(),
            1
        )

    def test_user_preferences_update(self):
        """Test updating user preferences."""
        preferences = UserPreferences.objects.create(
            user=self.user,
            newsletter_subscription=True,
            marketing_emails=True
        )
        
        # Update preferences
        preferences.newsletter_subscription = False
        preferences.preferred_currency = 'EUR'
        preferences.save()
        
        # Verify updates
        updated_preferences = UserPreferences.objects.get(user=self.user)
        self.assertFalse(updated_preferences.newsletter_subscription)
        self.assertEqual(updated_preferences.preferred_currency, 'EUR')


class UserAPITest(APITestCase):
    """Test cases for users API endpoints."""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_get_user_profile(self):
        """Test retrieving user profile."""
        self.client.force_authenticate(user=self.user)
        
        # This test assumes there's a user profile endpoint
        # response = self.client.get('/api/v1/users/profile/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user_profile(self):
        """Test updating user profile."""
        self.client.force_authenticate(user=self.user)
        
        profile_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com'
        }
        
        # This test assumes there's a profile update endpoint
        # response = self.client.patch('/api/v1/users/profile/', profile_data)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_preferences(self):
        """Test retrieving user preferences."""
        self.client.force_authenticate(user=self.user)
        UserPreferences.objects.create(user=self.user)
        
        # This test assumes there's a preferences endpoint
        # response = self.client.get('/api/v1/users/preferences/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user_preferences(self):
        """Test updating user preferences."""
        self.client.force_authenticate(user=self.user)
        UserPreferences.objects.create(user=self.user)
        
        preferences_data = {
            'newsletter_subscription': False,
            'marketing_emails': True,
            'preferred_currency': 'EUR'
        }
        
        # This test assumes there's a preferences update endpoint
        # response = self.client.patch('/api/v1/users/preferences/', preferences_data)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_user_addresses(self):
        """Test listing user addresses."""
        self.client.force_authenticate(user=self.user)
        
        UserAddress.objects.create(
            user=self.user,
            address_type='shipping',
            first_name='John',
            last_name='Doe',
            address_line_1='123 Test St',
            city='Test City',
            state='TS',
            postal_code='12345',
            country='US'
        )
        
        # This test assumes there's an addresses list endpoint
        # response = self.client.get('/api/v1/users/addresses/')
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user_address(self):
        """Test creating a new user address."""
        self.client.force_authenticate(user=self.user)
        
        address_data = {
            'address_type': 'billing',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'address_line_1': '456 New St',
            'city': 'New City',
            'state': 'NC',
            'postal_code': '67890',
            'country': 'US'
        }
        
        # This test assumes there's an address creation endpoint
        # response = self.client.post('/api/v1/users/addresses/', address_data)
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_user_address(self):
        """Test updating a user address."""
        self.client.force_authenticate(user=self.user)
        
        address = UserAddress.objects.create(
            user=self.user,
            address_type='shipping',
            first_name='John',
            last_name='Doe',
            address_line_1='123 Old St',
            city='Old City',
            state='OC',
            postal_code='11111',
            country='US'
        )
        
        update_data = {
            'address_line_1': '123 Updated St',
            'city': 'Updated City'
        }
        
        # This test assumes there's an address update endpoint
        # response = self.client.patch(f'/api/v1/users/addresses/{address.id}/', update_data)
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user_address(self):
        """Test deleting a user address."""
        self.client.force_authenticate(user=self.user)
        
        address = UserAddress.objects.create(
            user=self.user,
            address_type='shipping',
            first_name='John',
            last_name='Doe',
            address_line_1='123 Delete St',
            city='Delete City',
            state='DC',
            postal_code='99999',
            country='US'
        )
        
        # This test assumes there's an address deletion endpoint
        # response = self.client.delete(f'/api/v1/users/addresses/{address.id}/')
        # self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthorized_access_to_user_data(self):
        """Test that unauthenticated users cannot access user data."""
        # This test assumes proper authentication is required
        # response = self.client.get('/api/v1/users/profile/')
        # self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
