# Generated by Django 5.1 on 2024-08-30 14:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0004_alter_wishlist_stock'),
    ]

    operations = [
        migrations.AlterField(
            model_name='type',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='store.category'),
        ),
    ]