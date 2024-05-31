# Generated by Django 5.0.3 on 2024-05-28 16:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0024_alter_anonymousorder_status_alter_order_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='anonymousorder',
            name='status',
            field=models.CharField(choices=[('created', 'CREATED'), ('pending_for_pay', 'PENDING FOR PAY'), ('processing', 'PROCESSING'), ('completed', 'COMPLETED'), ('cancelled', 'CANCELLED'), ('partial_refunded', 'PARTIAL_REFUNDED'), ('refunded', 'REFUNDED')], default='created', max_length=20),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('created', 'CREATED'), ('pending_for_pay', 'PENDING FOR PAY'), ('processing', 'PROCESSING'), ('completed', 'COMPLETED'), ('cancelled', 'CANCELLED'), ('partial_refunded', 'PARTIAL_REFUNDED'), ('refunded', 'REFUNDED')], default='created', max_length=20),
        ),
    ]
