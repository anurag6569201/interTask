# Generated by Django 5.1.1 on 2024-10-03 04:03

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0002_chatbot_prompt'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatbot_prompt',
            name='uploaded_at',
            field=models.DateTimeField(default=datetime.datetime.now),
        ),
    ]