# Generated by Django 5.0.3 on 2024-03-13 16:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_item_description_item_discount_item_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='image',
            field=models.ImageField(null=True, upload_to='product_images/', verbose_name='Изображение'),
        ),
    ]
