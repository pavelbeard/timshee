# Generated by Django 5.0.3 on 2024-06-25 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0010_wishlist_session_key_wishlist_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='code',
            field=models.CharField(default='', max_length=100, unique=True, verbose_name='Код категории'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Имя категории'),
        ),
        migrations.AlterField(
            model_name='collection',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Коллекция'),
        ),
        migrations.AlterField(
            model_name='size',
            name='value',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='type',
            name='code',
            field=models.CharField(default='', max_length=50, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='type',
            name='name',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='wishlist',
            name='stock_link',
            field=models.CharField(default='', max_length=250),
            preserve_default=False,
        ),
    ]