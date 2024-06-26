# Generated by Django 5.0.3 on 2024-04-26 15:55

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0004_remove_cart_items'),
        ('sessions', '0001_initial'),
        ('store', '0003_remove_stock_discount_remove_stock_price_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AnonymousCart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='sessions.session')),
            ],
            options={
                'verbose_name': 'Anonymous cart',
                'verbose_name_plural': 'Anonymous carts',
            },
        ),
        migrations.CreateModel(
            name='AnonymousCartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity_in_cart', models.PositiveIntegerField(default=1)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('anon_cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cart.anonymouscart')),
                ('stock', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='store.stock')),
            ],
            options={
                'verbose_name': 'Anonymous car item',
                'verbose_name_plural': 'Anonymous car item',
                'unique_together': {('anon_cart', 'stock')},
            },
        ),
    ]
