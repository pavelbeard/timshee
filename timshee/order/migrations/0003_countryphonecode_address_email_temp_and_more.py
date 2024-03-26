# Generated by Django 5.0.3 on 2024-03-26 12:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0002_remove_address_country'),
    ]

    operations = [
        migrations.CreateModel(
            name='CountryPhoneCode',
            fields=[
                ('country', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='order.country')),
                ('phone_code', models.CharField(max_length=10)),
            ],
            options={
                'verbose_name': 'Country Phone Code',
                'verbose_name_plural': 'Country Phone Codes',
            },
        ),
        migrations.AddField(
            model_name='address',
            name='email',
            field=models.EmailField(max_length=254),
        ),
        migrations.AddField(
            model_name='address',
            name='interior',
            field=models.CharField(max_length=255),
        ),
        migrations.AddField(
            model_name='address',
            name='phone_number',
            field=models.CharField(max_length=20),
        ),
        migrations.AddField(
            model_name='address',
            name='phone_code',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='order.countryphonecode'),
        ),
    ]