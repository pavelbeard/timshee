import django_filters as filters

from store.models import Item


class ColorFilter(filters.CharFilter):
    def filter(self, qs, value):
        if value:
            return qs.filter(color__icontains=value)
        return qs


class ItemFilter(filters.FilterSet):
    color = ColorFilter(field_name='color', label='Color')

    class Meta:
        model = Item
        fields = {
            "gender": ["exact"],
            "color": ["exact"],
            "category": ["exact"],
            "collection": ["exact"],
            "price": ["exact", "lte", "gte"],
            "discount": ["exact", "lte", "gte"],
            "quantity": ["exact", "gte"],
        }

