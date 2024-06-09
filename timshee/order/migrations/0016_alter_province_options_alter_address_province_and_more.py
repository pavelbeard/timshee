# Generated by Django 5.0.3 on 2024-05-05 12:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0015_anonymousaddress_province_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='province',
            options={'verbose_name': 'Province', 'verbose_name_plural': 'Provinces'},
        ),
        migrations.AlterField(
            model_name='address',
            name='province',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='order.province'),
            preserve_default=False,
        ),
        # migrations.AlterField(
        #     model_name='anonymousaddress',
        #     name='province',
        #     field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='order.province'),
        # ),
        # migrations.AlterField(
        #     model_name='order',
        #     name='id',
        #     field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        # ),
    ]
