# Generated by Django 5.0.3 on 2024-05-23 15:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0022_alter_anonymousaddress_session'),
    ]

    operations = [
        migrations.AddField(
            model_name='anonymousaddress',
            name='is_last',
            field=models.BooleanField(default=False),
        ),
    ]
