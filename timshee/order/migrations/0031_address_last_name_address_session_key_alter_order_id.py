# Generated by Django 5.0.3 on 2024-06-10 16:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0030_orderitem_refund_reason'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='session_key',
            field=models.CharField(blank=True, max_length=40, null=True),
        ),
        migrations.AlterField(
            model_name='order',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
