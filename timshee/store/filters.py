import django_filters

from store import models as store_models


class ItemFilter(django_filters.FilterSet):
    o = django_filters.OrderingFilter(
        fields=(
            ('price', 'price',)
        )
    )

    class Meta:
        model = store_models.Item
        fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'price': ['gte', 'lte', 'gt', 'lt', 'exact', ],
            'discount': ['gte', 'lte', 'gt', 'lt', 'exact'],
            'sizes__value': ['exact'],
            'colors__name': ['exact', 'icontains', 'istartswith'],
            'collection__name': ['exact', 'icontains', 'istartswith'],
            'type__name': ['exact', 'icontains', 'istartswith'],
            'type__category__name': ['exact', 'icontains', 'istartswith'],
            # 'stock__price': ['gte', 'lte', 'exact']
        }

    @property
    def qs(self, *args, **kwargs):
        parent = super().qs
        return parent.distinct()


class StockFilter(django_filters.FilterSet):
    class Meta:
        model = store_models.Stock
        fields = {
            'id': ["exact"],
            'item__id': ["exact"],
            'item__name': ['exact', 'icontains', 'istartswith'],
            'item__description': ['exact', 'icontains', 'istartswith'],
            'item__gender': ['exact'],
            'item__collection__name': ['exact', 'icontains', 'istartswith'],
            'item__type__name': ['exact', 'icontains', 'istartswith'],
            'item__type__category__name': ['exact', 'icontains', 'istartswith'],
            'in_stock': ['gte', 'lte', 'gt', 'lt', 'exact'],
            'size__id': ['exact'],
            'size__value': ['exact'],
            'color__id': ['exact'],
            'color__name': ['exact', 'icontains', 'istartswith'],
        }

    # @property
    # def qs(self, *args, **kwargs):
    #     parent = super().qs
    #     return parent.distinct()
