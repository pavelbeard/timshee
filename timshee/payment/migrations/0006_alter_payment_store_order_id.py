# Generated by Django 5.0.7 on 2024-07-30 21:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0005_alter_payment_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='store_order_id',
            field=models.CharField(max_length=255),
        ),
    ]
