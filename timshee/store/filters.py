import django_filters

from store import models as store_models


class ItemFilter(django_filters.FilterSet):
    o = django_filters.OrderingFilter(
        fields=(
            ('price', 'price',),
            ('name', 'name')
        )
    )

    class Meta:
        model = store_models.Item
        fields = {
            'name': ['exact', 'icontains', 'istartswith'],
            'price': ['gte', 'lte', 'gt', 'lt', 'exact', ],
            'discount': ['gte', 'lte', 'gt', 'lt', 'exact'],
            'gender': ['exact'],
            'sizes__value': ['in', 'exact'],
            'colors__name': ['in', 'exact', 'icontains', 'istartswith'],
            'colors__hex': ['in', 'exact', 'icontains', 'istartswith'],
            'collection__name': ['in', 'exact', 'icontains', 'istartswith'],
            'collection__link': ['in', 'exact', 'icontains', 'istartswith'],
            'type__name': ['in', 'exact', 'icontains', 'istartswith'],
            'type__code': ['in', 'exact', 'icontains', 'istartswith'],
            'type__category__name': ['in', 'exact', 'icontains', 'istartswith'],
            'type__category__code': ['in', 'exact', 'icontains', 'istartswith'],
            # 'stock__price': ['gte', 'lte', 'exact']
        }

    @property
    def qs(self, *args, **kwargs):
        parent = super().qs
        return parent.distinct()


class StockFilter(django_filters.FilterSet):
    o = django_filters.OrderingFilter(
        fields=(
            ('item__price', 'price',),
            ('item__name', 'name')
        )
    )

    class Meta:
        model = store_models.Stock
        fields = {
            'id': ["exact"],
            'item__id': ["exact"],
            'item__name': ['exact', 'icontains', 'istartswith'],
            'item__description': ['exact', 'icontains', 'istartswith'],
            'item__price': ['gte', 'lte', 'gt', 'lt', 'exact', ],
            'item__gender': ['exact'],
            'item__collection__name': ['exact', 'icontains', 'istartswith'],
            'item__collection__link': ['in', 'exact', 'icontains', 'istartswith'],
            'item__type__name': ['in', 'exact', 'icontains', 'istartswith'],
            'item__type__code': ['in', 'exact', 'icontains', 'istartswith'],
            'item__type__category__name': ['in', 'exact', 'icontains', 'istartswith'],
            'item__type__category__code': ['in', 'exact', 'icontains', 'istartswith'],
            'in_stock': ['gte', 'lte', 'gt', 'lt', 'exact'],
            'size__id': ['exact', 'in'],
            'size__value': ['exact', 'in'],
            'color__id': ['exact', 'in'],
            'color__name': ['exact', 'in', 'icontains', 'istartswith'],
            'color__hex': ['exact', 'in', 'icontains', 'istartswith'],
        }


class WishlistItemFilter(django_filters.FilterSet):
    class Meta:
        model = store_models.Wishlist
        fields = {
            'stock__item_id': ['exact'],
            'stock__size_id': ['exact'],
            'stock__size__value': ['exact'],
            'stock__color_id': ['exact'],
            'stock__color__name': ['exact'],
            'stock__color__hex': ['exact'],
        }

