# Generated by Django 5.0.3 on 2024-03-19 18:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0004_alter_item_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='name',
            field=models.CharField(default='Без имени', max_length=100, verbose_name='Имя'),
        ),
    ]
