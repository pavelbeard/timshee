# Generated by Django 5.0.3 on 2024-04-25 12:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0031_size_alter_sizecolor_name'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='itemsizecolor',
            options={'verbose_name': 'Item size colors', 'verbose_name_plural': 'Item size colors'},
        ),
        migrations.RenameField(
            model_name='sizecolor',
            old_name='name',
            new_name='size',
        ),
        migrations.AlterUniqueTogether(
            name='sizecolor',
            unique_together={('size', 'color')},
        ),
    ]
