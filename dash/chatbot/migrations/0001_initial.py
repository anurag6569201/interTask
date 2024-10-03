# Generated by Django 5.1.1 on 2024-10-01 20:08

import chatbot.models
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PDFDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pdf_file', models.FileField(upload_to='pdfs/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['pdf']), chatbot.models.validate_file_size])),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
