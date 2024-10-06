# Generated by Django 5.1.1 on 2024-09-27 13:49

import django_ckeditor_5.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Letter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('letter_logo', models.ImageField(upload_to='letterhead/')),
                ('top_background_image', models.ImageField(blank=True, null=True, upload_to='letterhead/')),
                ('top_background_color', models.CharField(default='#FFFFFF', max_length=7)),
                ('top_right_text', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Text')),
                ('offer_letter', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Text')),
                ('middle_background_image', models.ImageField(blank=True, null=True, upload_to='letterhead/')),
                ('middle_background_color', models.CharField(default='#FFFFFF', max_length=7)),
                ('footer_left_text', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Text')),
                ('footer_right_text', django_ckeditor_5.fields.CKEditor5Field(blank=True, null=True, verbose_name='Text')),
                ('bottom_background_image', models.ImageField(blank=True, null=True, upload_to='letterhead/')),
                ('bottom_background_color', models.CharField(default='#FFFFFF', max_length=7)),
            ],
        ),
    ]