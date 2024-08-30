# Generated by Django 5.1 on 2024-08-23 10:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0008_alter_payment_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='status',
            field=models.CharField(choices=[('pending', 'PENDING'), ('waiting_for_capture', 'WAITING_FOR_CAPTURE'), ('partial_refunded', 'PARTIAL_REFUNDED'), ('refunded', 'REFUNDED'), ('succeeded', 'SUCCEEDED'), ('canceled', 'CANCELLED')], max_length=20),
        ),
    ]