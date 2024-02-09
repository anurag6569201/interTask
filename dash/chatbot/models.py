from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
import datetime

def validate_file_size(value):
    limit_mb = 5
    if value.size > limit_mb * 1024 * 1024:
        raise ValidationError(f"Max size of file is {limit_mb}MB")

class PDFDocument(models.Model):
    FILE_TYPE_CHOICES = [
        ('links', 'Links CSV'),
        ('text', 'Text CSV'),
    ]
    
    pdf_file = models.FileField(
        upload_to='data_csv/',
        validators=[FileExtensionValidator(allowed_extensions=['csv']), validate_file_size]
    )
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_file_type_display()} - {self.pdf_file.name}"


class chatbot_prompt(models.Model):
    prompt_text = models.TextField()
    uploaded_at = models.DateTimeField(default=datetime.datetime.now)
    

class QueryResponse(models.Model):
    user_id = models.CharField(max_length=255)
    user_query = models.TextField()
    ai_response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Query by {self.user_id} on {self.created_at}"