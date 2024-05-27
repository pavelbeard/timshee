# Generated by Django 5.0.3 on 2024-05-24 13:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0002_payment_captured_at_payment_created_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='store_order_id',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='payment',
            name='store_order_number',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
