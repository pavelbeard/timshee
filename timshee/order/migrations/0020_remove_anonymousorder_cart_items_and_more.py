# Generated by Django 5.0.3 on 2024-05-10 17:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0019_anonymousorder_ordered_items_order_ordered_items'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='cart_items',
        ),
    ]
