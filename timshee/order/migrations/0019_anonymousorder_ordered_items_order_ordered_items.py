# Generated by Django 5.0.3 on 2024-05-10 17:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0018_ordernumber_alter_anonymousorder_order_number_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='ordered_items',
            field=models.JSONField(blank=True, null=True),
        ),
    ]
