# Generated by Django 5.0.2 on 2024-03-14 13:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EventShow',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('eventImage', models.ImageField(upload_to='Events')),
                ('showName', models.CharField(max_length=200)),
                ('showTiming', models.DateTimeField(auto_now_add=True)),
                ('showPrice', models.IntegerField()),
                ('showVenue', models.CharField(max_length=100)),
            ],
        ),
    ]
