from django import forms
from .models import PDFDocument
from .models import chatbot_prompt

class PDFDocumentForm(forms.ModelForm):
    class Meta:
        model = PDFDocument
        fields = ['pdf_file', 'file_type']

class PromptForm(forms.ModelForm):
    class Meta:
        model = chatbot_prompt
        fields = ['prompt_text']
        widgets = {
            'prompt_text': forms.Textarea(attrs={'rows': 8, 'cols': 40}),
        }