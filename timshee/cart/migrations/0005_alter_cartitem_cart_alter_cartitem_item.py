# Generated by Django 5.0.3 on 2024-03-20 19:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0004_remove_cart_id_remove_cartitem_id_alter_cart_user_and_more'),
        ('store', '0006_item_quantity'),
    ]

    operations = [
        # raise an error
        # migrations.AlterField(
        #     model_name='cartitem',
        #     name='cart',
        #     field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='items', serialize=False, to='cart.cart', verbose_name='Корзина'),
        # ),
        # migrations.AlterField(
        #     model_name='cartitem',
        #     name='item',
        #     field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='store.item', verbose_name='Товар'),
        # ),
    ]
