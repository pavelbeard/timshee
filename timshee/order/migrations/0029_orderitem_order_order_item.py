# Generated by Django 5.0.3 on 2024-06-02 00:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0028_alter_order_status'),
        ('store', '0005_alter_item_discount_alter_item_price'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=0)),
                ('item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='store.stock')),
                ('order', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='order.order')),
            ],
            options={
                'verbose_name': 'Order Item',
                'verbose_name_plural': 'Order Items',
                'unique_together': {('order', 'item')},
            },
        ),
        migrations.AddField(
            model_name='order',
            name='order_item',
            field=models.ManyToManyField(through='order.OrderItem', to='store.stock'),
        ),
    ]
