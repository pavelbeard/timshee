import re

import django_filters as filters

from store.models import Item, Category, ItemSizeColor


class HexColorFilter(filters.CharFilter):
    def filter(self, qs, value):
        if value:
            size_ids = ItemSizeColor.objects.filter(color__hex=value).values_list('id', flat=True)
            return qs.filter(sizes__in=size_ids)
        return qs


class SizeColorAuxFilter(filters.CharFilter):
    def filter(self, qs, value):
        if ".color=" in value:
            value = value.replace(".color=", "")
            size_ids = ItemSizeColor.objects.filter(color__hex=f"#{value}").values_list('id', flat=True)
            print(size_ids)
            return qs.filter(sizes_colors_in=size_ids)
        elif value:
            if len(re.findall("!|,", value)) > 0:
                value = value.replace("!", "")
                values = value.split(",", "")
                if len(values) == 1:
                    return qs.exclude(name=value)
                else:
                    return qs.exclude(name__in=values)
            return qs.filter(sizes__name=value)

        return qs


class CategoryAuxFilter(filters.CharFilter):
    def filter(self, qs, value):
        if value:
            if len(re.findall(r'!|,', value)) > 0:
                value = value.replace("!", "")
                values = value.split(",")
                if len(values) == 1:
                    return qs.exclude(name=value)
                else:
                    return qs.exclude(name__in=values)
            else:
                return qs.filter(name=value)

        return qs


class ItemFilter(filters.FilterSet):
    sizes_colors = SizeColorAuxFilter(field_name='size', label='Size')

    class Meta:
        model = Item
        fields = {
            "gender": ["exact"],
            "sizes_colors": ["exact"],
            "type": ["exact"],
            "collection": ["exact"],
            "price": ["exact", "lte", "gte"],
            "discount": ["exact", "lte", "gte"],
            "quantity": ["exact", "gte"],
        }


class CategoryFilter(filters.FilterSet):
    name = CategoryAuxFilter(field_name='name', label='Name')

    class Meta:
        model = Category
        fields = {
            "name": ["exact"],
        }
