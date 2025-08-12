"""
Payment gateways package.
"""

from .base import PaymentGateway, PaymentGatewayError, PaymentResult
from .mock_gateway import MockGateway

# Try to import optional gateways
try:
    from .stripe_gateway import StripeGateway
except ImportError:
    StripeGateway = None

try:
    from .paypal_gateway import PayPalGateway
except ImportError:
    PayPalGateway = None

__all__ = [
    'PaymentGateway',
    'PaymentGatewayError', 
    'PaymentResult',
    'MockGateway',
]

# Add optional gateways if available
if StripeGateway:
    __all__.append('StripeGateway')
if PayPalGateway:
    __all__.append('PayPalGateway')
