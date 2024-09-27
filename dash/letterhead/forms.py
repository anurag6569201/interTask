from django import forms
from .models import Letter
from django_ckeditor_5.widgets import CKEditor5Widget

class LetterForm(forms.ModelForm):
    top_right_text = forms.CharField(widget=CKEditor5Widget(config_name='extends'))
    offer_letter = forms.CharField(widget=CKEditor5Widget(config_name='extends'))
    footer_left_text = forms.CharField(widget=CKEditor5Widget(config_name='extends'))
    footer_right_text = forms.CharField(widget=CKEditor5Widget(config_name='extends'))

    class Meta:
        model = Letter
        fields = [
            'letter_logo', 
            'top_background_image', 
            'middle_background_image', 
            'bottom_background_image',
            'top_right_text',
            'offer_letter',
            'footer_left_text', 
            'footer_right_text'
        ]
        widgets = {
            'letter_logo': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'top_background_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'middle_background_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
            'bottom_background_image': forms.ClearableFileInput(attrs={'class': 'form-control'}),
        }
