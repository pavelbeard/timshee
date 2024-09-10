from collections import defaultdict

from django.db.models import Count

from . import models


def get_product_counts():
    color_count = defaultdict(int)
    size_count = defaultdict(int)
    type_count = defaultdict(int)

    products = models.Item.objects.all()

    # Подсчет цветов
    for product in products:
        for color in product.colors.all():
            color_count[color.name] += 1

    # Подсчет размеров
    for product in products:
        for size in product.sizes.all():
            size_count[size.value] += 1

    # Подсчет типов
    type_counts = products.values('type__name').annotate(count=Count('id'))
    for entry in type_counts:
        type_count[entry['type__name']] = entry['count']

    return {
        "color_count": dict(color_count),
        "size_count": dict(size_count),
        "type_count": dict(type_count)
    }
