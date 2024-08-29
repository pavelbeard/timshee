# Generated by Django 5.0.7 on 2024-07-31 09:44

import shortuuid.django_fields
import stuff.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stuff', '0009_resetpasswordcase_delete_resetpasswordcases'),
    ]

    operations = [
        migrations.CreateModel(
            name='OwnerData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('tax_number', models.CharField(max_length=255)),
                ('contact_number', models.CharField(max_length=255)),
                ('email', models.CharField(max_length=255)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='resetpasswordcase',
            name='until',
            field=models.DateTimeField(default=stuff.models.get_until_time),
        ),
        migrations.AlterField(
            model_name='resetpasswordcase',
            name='uuid',
            field=shortuuid.django_fields.ShortUUIDField(alphabet=None, editable=False, length=16, max_length=32, prefix='', primary_key=True, serialize=False),
        ),
    ]
