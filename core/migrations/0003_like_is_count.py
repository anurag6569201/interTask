# Generated by Django 5.0.2 on 2024-03-14 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_like'),
    ]

    operations = [
        migrations.AddField(
            model_name='like',
            name='is_count',
            field=models.BooleanField(default=False),
        ),
    ]
