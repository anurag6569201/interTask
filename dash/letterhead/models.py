from django.db import models
from django_ckeditor_5.fields import CKEditor5Field


class Letter(models.Model):
    letter_logo = models.ImageField(upload_to='letterhead/')
    top_background_image = models.ImageField(upload_to='letterhead/', blank=True, null=True)
    top_right_text = CKEditor5Field('Text', config_name='extends', blank=True, null=True)
    
    offer_letter = CKEditor5Field('Text', config_name='extends', blank=True, null=True)
    middle_background_image = models.ImageField(upload_to='letterhead/', blank=True, null=True)

    footer_left_text = CKEditor5Field('Text', config_name='extends', blank=True, null=True)
    footer_right_text = CKEditor5Field('Text', config_name='extends', blank=True, null=True)
    bottom_background_image = models.ImageField(upload_to='letterhead/', blank=True, null=True)
