"""
Unit tests for the payments application.
"""

from decimal import Decimal
from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

from .models import (
    PaymentMethod,
    Payment,
    PaymentRefund,
    PaymentWebhook,
    PaymentIntent
)
from .services import PaymentService, PaymentGatewayService
from .gateways.base import (
    PaymentResult,
    RefundResult,
    PaymentStatus,
    RefundStatus,
    PaymentMethodData,
    CustomerData
)
from .gateways.mock_gateway import MockGateway


class PaymentMethodModelTest(TestCase):
    """Test PaymentMethod model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_payment_method(self):
        """Test creating a payment method."""
        payment_method = PaymentMethod.objects.create(
            user=self.user,
            name='Test Card',
            payment_type='credit_card',
            provider='stripe',
            provider_method_id='pm_test123',
            card_last_four='4242',
            card_brand='visa',
            card_exp_month=12,
            card_exp_year=2025
        )
        
        self.assertEqual(payment_method.user, self.user)
        self.assertEqual(payment_method.name, 'Test Card')
        self.assertEqual(payment_method.payment_type, 'credit_card')
        self.assertEqual(payment_method.provider, 'stripe')
        self.assertEqual(payment_method.provider_method_id, 'pm_test123')
        self.assertEqual(payment_method.card_last_four, '4242')
        self.assertEqual(payment_method.card_brand, 'visa')
        self.assertTrue(payment_method.is_active)
        self.assertFalse(payment_method.is_default)
    
    def test_payment_method_str(self):
        """Test PaymentMethod string representation."""
        payment_method = PaymentMethod.objects.create(
            user=self.user,
            name='Visa Card',
            payment_type='credit_card',
            provider='stripe',
            provider_method_id='pm_test123',
            card_last_four='4242'
        )
        
        self.assertEqual(str(payment_method), 'Visa Card •••• 4242')
    
    def test_default_payment_method_uniqueness(self):
        """Test that only one payment method can be default per user."""
        # Create first default payment method
        pm1 = PaymentMethod.objects.create(
            user=self.user,
            name='Card 1',
            payment_type='credit_card',
            provider='stripe',
            provider_method_id='pm_test1',
            is_default=True
        )
        
        # Create second default payment method
        pm2 = PaymentMethod.objects.create(
            user=self.user,
            name='Card 2',
            payment_type='credit_card',
            provider='stripe',
            provider_method_id='pm_test2',
            is_default=True
        )
        
        # Refresh from database
        pm1.refresh_from_db()
        pm2.refresh_from_db()
        
        # Only the second one should be default
        self.assertFalse(pm1.is_default)
        self.assertTrue(pm2.is_default)
    
    def test_payment_method_validation(self):
        """Test PaymentMethod validation."""
        payment_method = PaymentMethod(
            user=self.user,
            name='Test Card',
            payment_type='credit_card',
            provider='stripe',
            provider_method_id='pm_test123',
            card_exp_month=13,  # Invalid month
            card_exp_year=2020  # Expired year
        )
        
        with self.assertRaises(ValidationError):
            payment_method.full_clean()


class PaymentModelTest(TestCase):
    """Test Payment model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_payment(self):
        """Test creating a payment."""
        payment = Payment.objects.create(
            user=self.user,
            amount=Decimal('99.99'),
            currency='USD',
            status='completed',
            gateway='stripe',
            gateway_transaction_id='txn_test123',
            description='Test payment',
            reference_id='order_123'
        )
        
        self.assertEqual(payment.user, self.user)
        self.assertEqual(payment.amount, Decimal('99.99'))
        self.assertEqual(payment.currency, 'USD')
        self.assertEqual(payment.status, 'completed')
        self.assertEqual(payment.gateway, 'stripe')
        self.assertTrue(payment.is_successful)
        self.assertFalse(payment.is_pending)
        self.assertFalse(payment.is_failed)
    
    def test_payment_str(self):
        """Test Payment string representation."""
        payment = Payment.objects.create(
            user=self.user,
            amount=Decimal('99.99'),
            currency='USD',
            gateway='stripe'
        )
        
        expected_str = f"Payment {payment.payment_id} - 99.99 USD"
        self.assertEqual(str(payment), expected_str)
    
    def test_payment_status_properties(self):
        """Test payment status properties."""
        # Test successful payment
        payment = Payment.objects.create(
            user=self.user,
            amount=Decimal('50.00'),
            currency='USD',
            status='completed',
            gateway='stripe'
        )
        
        self.assertTrue(payment.is_successful)
        self.assertFalse(payment.is_pending)
        self.assertFalse(payment.is_failed)
        self.assertTrue(payment.can_be_refunded())
        
        # Test pending payment
        payment.status = 'pending'
        payment.save()
        
        self.assertFalse(payment.is_successful)
        self.assertTrue(payment.is_pending)
        self.assertFalse(payment.is_failed)
        
        # Test failed payment
        payment.status = 'failed'
        payment.save()
        
        self.assertFalse(payment.is_successful)
        self.assertFalse(payment.is_pending)
        self.assertTrue(payment.is_failed)
    
    def test_net_amount_calculation(self):
        """Test automatic net amount calculation."""
        payment = Payment.objects.create(
            user=self.user,
            amount=Decimal('100.00'),
            currency='USD',
            fee_amount=Decimal('3.20'),
            gateway='stripe'
        )
        
        self.assertEqual(payment.net_amount, Decimal('96.80'))


class PaymentRefundModelTest(TestCase):
    """Test PaymentRefund model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.payment = Payment.objects.create(
            user=self.user,
            amount=Decimal('100.00'),
            currency='USD',
            status='completed',
            gateway='stripe',
            gateway_transaction_id='txn_test123'
        )
    
    def test_create_refund(self):
        """Test creating a refund."""
        refund = PaymentRefund.objects.create(
            payment=self.payment,
            amount=Decimal('50.00'),
            reason='Customer request'
        )
        
        self.assertEqual(refund.payment, self.payment)
        self.assertEqual(refund.amount, Decimal('50.00'))
        self.assertEqual(refund.currency, 'USD')  # Should inherit from payment
        self.assertEqual(refund.reason, 'Customer request')
    
    def test_refund_validation(self):
        """Test refund amount validation."""
        # Create a partial refund first
        PaymentRefund.objects.create(
            payment=self.payment,
            amount=Decimal('60.00'),
            status='completed'
        )
        
        # Try to create another refund that exceeds the payment amount
        refund = PaymentRefund(
            payment=self.payment,
            amount=Decimal('50.00')  # Total would be 110.00, exceeds payment of 100.00
        )
        
        with self.assertRaises(ValidationError):
            refund.full_clean()


class PaymentIntentModelTest(TestCase):
    """Test PaymentIntent model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_payment_intent(self):
        """Test creating a payment intent."""
        intent = PaymentIntent.objects.create(
            user=self.user,
            amount=Decimal('75.00'),
            currency='USD',
            gateway='stripe',
            description='Test intent'
        )
        
        self.assertEqual(intent.user, self.user)
        self.assertEqual(intent.amount, Decimal('75.00'))
        self.assertEqual(intent.currency, 'USD')
        self.assertEqual(intent.gateway, 'stripe')
        self.assertEqual(intent.status, 'requires_payment_method')
        self.assertFalse(intent.is_successful)
        self.assertFalse(intent.requires_action)
    
    def test_payment_intent_status_properties(self):
        """Test payment intent status properties."""
        intent = PaymentIntent.objects.create(
            user=self.user,
            amount=Decimal('75.00'),
            currency='USD',
            gateway='stripe',
            status='succeeded'
        )
        
        self.assertTrue(intent.is_successful)
        
        intent.status = 'requires_action'
        intent.save()
        
        self.assertTrue(intent.requires_action)


class PaymentWebhookModelTest(TestCase):
    """Test PaymentWebhook model."""
    
    def test_create_webhook(self):
        """Test creating a webhook."""
        webhook = PaymentWebhook.objects.create(
            gateway='stripe',
            event_type='payment_intent.succeeded',
            gateway_event_id='evt_test123',
            payload={'test': 'data'},
            headers={'content-type': 'application/json'}
        )
        
        self.assertEqual(webhook.gateway, 'stripe')
        self.assertEqual(webhook.event_type, 'payment_intent.succeeded')
        self.assertEqual(webhook.gateway_event_id, 'evt_test123')
        self.assertEqual(webhook.status, 'pending')
    
    def test_webhook_processing_methods(self):
        """Test webhook processing methods."""
        webhook = PaymentWebhook.objects.create(
            gateway='stripe',
            event_type='payment_intent.succeeded',
            gateway_event_id='evt_test123',
            payload={'test': 'data'}
        )
        
        # Test mark as processed
        webhook.mark_as_processed()
        self.assertEqual(webhook.status, 'processed')
        self.assertIsNotNone(webhook.processed_at)
        
        # Test mark as failed
        webhook.mark_as_failed('Test error')
        self.assertEqual(webhook.status, 'failed')
        self.assertEqual(webhook.error_message, 'Test error')


class MockGatewayTest(TestCase):
    """Test MockGateway implementation."""
    
    def setUp(self):
        self.gateway = MockGateway({
            'simulate_failures': False,
            'failure_rate': 0.0,
            'processing_delay': 0
        })
        
        self.customer_data = CustomerData(
            email='test@example.com',
            name='Test User'
        )
        
        self.payment_method_data = PaymentMethodData(
            method_type='card',
            card_number='4242424242424242',
            card_exp_month=12,
            card_exp_year=2025,
            card_cvc='123'
        )
    
    def test_gateway_name(self):
        """Test gateway name."""
        self.assertEqual(self.gateway.get_gateway_name(), 'mock')
    
    def test_create_payment_intent(self):
        """Test creating a payment intent."""
        result = self.gateway.create_payment_intent(
            amount=Decimal('100.00'),
            currency='USD',
            customer_data=self.customer_data,
            payment_method_data=self.payment_method_data,
            description='Test payment'
        )
        
        self.assertTrue(result.success)
        self.assertEqual(result.status, PaymentStatus.REQUIRES_ACTION)
        self.assertIsNotNone(result.transaction_id)
        self.assertTrue(result.requires_action)
    
    def test_confirm_payment(self):
        """Test confirming a payment."""
        # First create an intent
        intent_result = self.gateway.create_payment_intent(
            amount=Decimal('100.00'),
            currency='USD',
            customer_data=self.customer_data,
            payment_method_data=self.payment_method_data
        )
        
        # Then confirm it
        confirm_result = self.gateway.confirm_payment(intent_result.transaction_id)
        
        self.assertTrue(confirm_result.success)
        self.assertEqual(confirm_result.status, PaymentStatus.COMPLETED)
        self.assertIsNotNone(confirm_result.fee_amount)
    
    def test_create_refund(self):
        """Test creating a refund."""
        # First create and confirm a payment
        intent_result = self.gateway.create_payment_intent(
            amount=Decimal('100.00'),
            currency='USD',
            customer_data=self.customer_data,
            payment_method_data=self.payment_method_data
        )
        
        self.gateway.confirm_payment(intent_result.transaction_id)
        
        # Create refund
        refund_result = self.gateway.create_refund(
            intent_result.transaction_id,
            amount=Decimal('50.00'),
            reason='Customer request'
        )
        
        self.assertTrue(refund_result.success)
        self.assertEqual(refund_result.status, RefundStatus.COMPLETED)
        self.assertIsNotNone(refund_result.refund_id)
    
    def test_save_payment_method(self):
        """Test saving a payment method."""
        result = self.gateway.save_payment_method(
            self.customer_data,
            self.payment_method_data
        )
        
        self.assertIsInstance(result, dict)
        self.assertIn('payment_method_id', result)
        self.assertIn('customer_id', result)
        self.assertEqual(result['type'], 'card')
    
    def test_simulated_failure(self):
        """Test simulated failures."""
        gateway = MockGateway({
            'simulate_failures': True,
            'failure_rate': 1.0  # Always fail
        })
        
        result = gateway.create_payment_intent(
            amount=Decimal('100.00'),
            currency='USD',
            customer_data=self.customer_data,
            payment_method_data=self.payment_method_data
        )
        
        self.assertFalse(result.success)
        self.assertEqual(result.status, PaymentStatus.FAILED)
        self.assertIsNotNone(result.error_message)
    
    def test_invalid_amount(self):
        """Test invalid payment amount."""
        result = self.gateway.create_payment_intent(
            amount=Decimal('0.00'),
            currency='USD',
            customer_data=self.customer_data,
            payment_method_data=self.payment_method_data
        )
        
        self.assertFalse(result.success)
        self.assertEqual(result.status, PaymentStatus.FAILED)
        self.assertEqual(result.error_code, 'invalid_amount')


class PaymentGatewayServiceTest(TestCase):
    """Test PaymentGatewayService."""
    
    def test_gateway_registration(self):
        """Test gateway registration and retrieval."""
        service = PaymentGatewayService()
        
        # Test default gateways are registered
        available_gateways = service.get_available_gateways()
        self.assertIn('mock', available_gateways)
        
        # Test getting a gateway
        gateway = service.get_gateway('mock')
        self.assertIsInstance(gateway, MockGateway)
    
    def test_invalid_gateway(self):
        """Test getting an invalid gateway."""
        service = PaymentGatewayService()
        
        with self.assertRaises(ValueError):
            service.get_gateway('invalid_gateway')
    
    def test_default_gateway(self):
        """Test getting default gateway."""
        service = PaymentGatewayService()
        default_gateway = service.get_default_gateway()
        self.assertEqual(default_gateway, 'mock')


class PaymentServiceTest(TestCase):
    """Test PaymentService."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.service = PaymentService()
    
    def test_create_payment_intent(self):
        """Test creating a payment intent."""
        intent = self.service.create_payment_intent(
            user=self.user,
            amount=Decimal('99.99'),
            currency='USD',
            description='Test payment',
            reference_id='order_123'
        )
        
        self.assertEqual(intent.user, self.user)
        self.assertEqual(intent.amount, Decimal('99.99'))
        self.assertEqual(intent.currency, 'USD')
        self.assertEqual(intent.gateway, 'mock')
        self.assertEqual(intent.description, 'Test payment')
        self.assertEqual(intent.reference_id, 'order_123')
    
    @patch('src.apps.payments.services.PaymentGatewayService.get_gateway')
    def test_confirm_payment_intent(self, mock_get_gateway):
        """Test confirming a payment intent."""
        # Setup mock gateway
        mock_gateway = MagicMock()
        mock_gateway.confirm_payment.return_value = PaymentResult(
            success=True,
            status=PaymentStatus.COMPLETED,
            transaction_id='txn_123',
            fee_amount=Decimal('2.90')
        )
        mock_get_gateway.return_value = mock_gateway
        
        # Create intent
        intent = PaymentIntent.objects.create(
            user=self.user,
            amount=Decimal('100.00'),
            currency='USD',
            gateway='mock',
            gateway_intent_id='intent_123'
        )
        
        # Confirm intent
        result = self.service.confirm_payment_intent(str(intent.intent_id))
        
        self.assertTrue(result.success)
        self.assertEqual(result.status, PaymentStatus.COMPLETED)
        
        # Check that payment was created
        intent.refresh_from_db()
        self.assertIsNotNone(intent.payment)
        self.assertEqual(intent.payment.status, 'completed')
    
    def test_save_payment_method(self):
        """Test saving a payment method."""
        payment_method_data = PaymentMethodData(
            method_type='card',
            card_number='4242424242424242',
            card_exp_month=12,
            card_exp_year=2025
        )
        
        with patch('src.apps.payments.services.PaymentGatewayService.get_gateway') as mock_get_gateway:
            mock_gateway = MagicMock()
            mock_gateway.save_payment_method.return_value = {
                'id': 'pm_test123',
                'card': {
                    'last4': '4242',
                    'brand': 'visa',
                    'exp_month': 12,
                    'exp_year': 2025
                }
            }
            mock_get_gateway.return_value = mock_gateway
            
            payment_method = self.service.save_payment_method(
                user=self.user,
                payment_method_data=payment_method_data,
                name='Test Card',
                is_default=True
            )
            
            self.assertEqual(payment_method.user, self.user)
            self.assertEqual(payment_method.name, 'Test Card')
            self.assertEqual(payment_method.payment_type, 'card')
            self.assertEqual(payment_method.card_last_four, '4242')
            self.assertEqual(payment_method.card_brand, 'visa')
            self.assertTrue(payment_method.is_default)
    
    def test_process_webhook(self):
        """Test processing a webhook."""
        payload = {
            'id': 'evt_test123',
            'type': 'payment_intent.succeeded',
            'data': {'id': 'pi_test123'}
        }
        headers = {'stripe-signature': 'test_signature'}
        
        with patch('src.apps.payments.services.PaymentGatewayService.get_gateway') as mock_get_gateway:
            mock_gateway = MagicMock()
            mock_gateway.handle_webhook.return_value = {
                'event_id': 'evt_test123',
                'type': 'payment_intent.succeeded',
                'data': {'id': 'pi_test123'}
            }
            mock_get_gateway.return_value = mock_gateway
            
            webhook = self.service.process_webhook(
                gateway_name='stripe',
                payload=payload,
                headers=headers
            )
            
            self.assertEqual(webhook.gateway, 'stripe')
            self.assertEqual(webhook.event_type, 'payment_intent.succeeded')
            self.assertEqual(webhook.gateway_event_id, 'evt_test123')
            self.assertEqual(webhook.status, 'processed')


class PaymentBaseTest(TestCase):
    """Test payment base classes and utilities."""
    
    def test_payment_result(self):
        """Test PaymentResult class."""
        result = PaymentResult(
            success=True,
            status=PaymentStatus.COMPLETED,
            transaction_id='txn_123'
        )
        
        self.assertTrue(result.is_successful)
        self.assertFalse(result.is_pending)
        self.assertFalse(result.is_failed)
    
    def test_refund_result(self):
        """Test RefundResult class."""
        result = RefundResult(
            success=True,
            status=RefundStatus.COMPLETED,
            refund_id='ref_123'
        )
        
        self.assertTrue(result.success)
        self.assertEqual(result.status, RefundStatus.COMPLETED)
    
    def test_customer_data(self):
        """Test CustomerData class."""
        customer_data = CustomerData(
            email='test@example.com',
            name='Test User',
            phone='+1234567890'
        )
        
        self.assertEqual(customer_data.email, 'test@example.com')
        self.assertEqual(customer_data.name, 'Test User')
        self.assertEqual(customer_data.phone, '+1234567890')
    
    def test_payment_method_data(self):
        """Test PaymentMethodData class."""
        pm_data = PaymentMethodData(
            method_type='card',
            card_number='4242424242424242',
            card_exp_month=12,
            card_exp_year=2025,
            card_cvc='123'
        )
        
        self.assertEqual(pm_data.method_type, 'card')
        self.assertEqual(pm_data.card_number, '4242424242424242')
        self.assertEqual(pm_data.card_exp_month, 12)


class PaymentIntegrationTest(TestCase):
    """Integration tests for the payments system."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.service = PaymentService()
    
    def test_full_payment_flow(self):
        """Test a complete payment flow from intent to completion."""
        # Create payment intent
        intent = self.service.create_payment_intent(
            user=self.user,
            amount=Decimal('149.99'),
            currency='USD',
            description='Full payment test',
            reference_id='test_order_456'
        )
        
        self.assertIsInstance(intent, PaymentIntent)
        self.assertEqual(intent.amount, Decimal('149.99'))
        
        # Create payment method data
        payment_method_data = PaymentMethodData(
            method_type='card',
            card_number='4242424242424242',
            card_exp_month=12,
            card_exp_year=2025,
            card_cvc='123'
        )
        
        # Confirm payment
        result = self.service.confirm_payment_intent(
            str(intent.intent_id),
            payment_method_data
        )
        
        self.assertTrue(result.success)
        self.assertEqual(result.status, PaymentStatus.COMPLETED)
        
        # Verify payment was created
        intent.refresh_from_db()
        self.assertIsNotNone(intent.payment)
        self.assertEqual(intent.payment.amount, Decimal('149.99'))
        self.assertEqual(intent.payment.status, 'completed')
    
    def test_payment_and_refund_flow(self):
        """Test payment and subsequent refund."""
        # Create and confirm payment
        intent = self.service.create_payment_intent(
            user=self.user,
            amount=Decimal('200.00'),
            currency='USD'
        )
        
        payment_method_data = PaymentMethodData(
            method_type='card',
            card_number='4242424242424242',
            card_exp_month=12,
            card_exp_year=2025
        )
        
        result = self.service.confirm_payment_intent(
            str(intent.intent_id),
            payment_method_data
        )
        
        self.assertTrue(result.success)
        
        # Create refund
        intent.refresh_from_db()
        payment = intent.payment
        
        refund = self.service.create_refund(
            str(payment.payment_id),
            amount=Decimal('100.00'),
            reason='Partial refund test'
        )
        
        self.assertIsInstance(refund, PaymentRefund)
        self.assertEqual(refund.amount, Decimal('100.00'))
        self.assertEqual(refund.status, 'completed')
        
        # Check payment status updated
        payment.refresh_from_db()
