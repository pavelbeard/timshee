import pdb

from django.conf import settings
from django.contrib.auth.models import User
from django.db.models import Sum
from django.test import TestCase, TransactionTestCase

from order import models as order_models
from store import models as store_models


class EmailTest(TestCase):
    databases = {"default"}
    fixtures = ['user.json']

    def setUp(self):
        # self.items = store_models.Item.objects.filter(collection=1, gender='M')
        # self.orders = order_models.Order.objects.all()
        self.users = User.objects.all()

    def check_fixtures_loaded(self):
        if not order_models.Address.objects.exists():
            raise AssertionError('Address table was not created')

    def test_send_email(self):
        # print(self.orders)
        print(self.users)

    def test_databases(self):
        # result = managers.get_product_counts()
        print(self.items.values('stock__size__value').annotate(total=Sum('stock__in_stock')))
        print(self.items.values('stock__color__name').annotate(total=Sum('stock__in_stock')))
        print(self.items.values('type__name').annotate(total=Sum('stock__in_stock')))
        # print(result)
