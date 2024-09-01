# Generated by Django 5.1 on 2024-09-01 12:06

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stuff', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='dynamicsettings',
            name='compress_pics_on_server',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='dynamicsettings',
            name='international',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='emailtoken',
            name='until',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 1, 18, 6, 39, 357043)),
        ),
    ]
