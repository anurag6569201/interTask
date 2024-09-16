# Generated by Django 5.0.2 on 2024-09-16 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0004_alter_item_item_name_alter_item_item_number_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='item_name',
            field=models.CharField(blank=True, default='N/A', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='item_number',
            field=models.IntegerField(blank=True, default=1, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='price_incl_tax',
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='price_per_unit',
            field=models.DecimalField(blank=True, decimal_places=2, default=0.0, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='item',
            name='quantity',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
