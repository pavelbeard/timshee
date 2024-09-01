# Generated by Django 5.1 on 2024-09-01 12:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0006_alter_carouselimage_image_alter_carouselimage_item_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CurrencyMultiplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('euro', models.DecimalField(decimal_places=2, default=1, max_digits=8)),
                ('dollar', models.DecimalField(decimal_places=2, default=1, max_digits=8)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]