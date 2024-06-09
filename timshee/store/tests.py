from django.conf import settings
from django.db.models import Sum
from django.test import TestCase

from . import models, managers


# Create your tests here.

class StoreTestCase(TestCase):
    databases = {'default'}
    fixtures = ['store_data.json']

    def setUp(self):
        self.items = models.Item.objects.filter(collection=1, gender='M')

    def test_databases(self):
        # result = managers.get_product_counts()
        print(self.items.values('stock__size__value').annotate(total=Sum('stock__in_stock')))
        print(self.items.values('stock__color__name').annotate(total=Sum('stock__in_stock')))
        print(self.items.values('type__name').annotate(total=Sum('stock__in_stock')))
        # print(result)
