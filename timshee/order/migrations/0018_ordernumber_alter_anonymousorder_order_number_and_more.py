# Generated by Django 5.0.3 on 2024-05-10 16:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0017_anonymousorder_order_number_order_order_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='OrderNumber',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_order_id', models.PositiveIntegerField(default=10000)),
            ],
        ),
        # migrations.AlterField(
        #     model_name='anonymousorder',
        #     name='order_number',
        #     field=models.CharField(max_length=255, unique=True),
        # ),
        migrations.AlterField(
            model_name='order',
            name='order_number',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]