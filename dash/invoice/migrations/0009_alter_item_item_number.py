# Generated by Django 5.1.1 on 2024-09-26 02:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0008_invoice_clint_gst_invoice_payment_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='item_number',
            field=models.CharField(blank=True, default='N/A', max_length=255, null=True),
        ),
    ]
