# Generated by Django 5.1 on 2024-08-25 20:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_alter_item_gender'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='color',
            options={'verbose_name': 'Color', 'verbose_name_plural': 'Colors'},
        ),
        migrations.AlterModelOptions(
            name='size',
            options={'verbose_name': 'Size', 'verbose_name_plural': 'Sizes'},
        ),
    ]