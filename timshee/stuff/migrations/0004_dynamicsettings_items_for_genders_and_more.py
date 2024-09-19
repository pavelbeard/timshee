# Generated by Django 5.1 on 2024-09-19 08:00

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stuff', '0003_alter_emailtoken_until'),
    ]

    operations = [
        migrations.AddField(
            model_name='dynamicsettings',
            name='items_for_genders',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='emailtoken',
            name='until',
            field=models.DateTimeField(default=datetime.datetime(2024, 9, 19, 14, 0, 29, 236088)),
        ),
    ]
