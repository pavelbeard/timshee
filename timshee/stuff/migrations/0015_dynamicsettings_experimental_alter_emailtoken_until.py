# Generated by Django 5.1 on 2024-08-25 20:45

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stuff', '0014_alter_emailtoken_until_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='dynamicsettings',
            name='experimental',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='emailtoken',
            name='until',
            field=models.DateTimeField(default=datetime.datetime(2024, 8, 25, 21, 45, 30, 523007, tzinfo=datetime.timezone.utc)),
        ),
    ]
