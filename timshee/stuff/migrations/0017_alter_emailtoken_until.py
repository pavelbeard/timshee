# Generated by Django 5.1 on 2024-08-28 14:14

from django.db import migrations, models

import stuff.models


class Migration(migrations.Migration):

    dependencies = [
        ('stuff', '0016_userprofile_email_confirmed_alter_emailtoken_until_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emailtoken',
            name='until',
            field=models.DateTimeField(default=stuff.models.get_until_time),
        ),
    ]
