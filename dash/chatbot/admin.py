from django.contrib import admin
from .models import chatbot_prompt,PDFDocument,QueryResponse

admin.site.register(chatbot_prompt)
admin.site.register(PDFDocument)
admin.site.register(QueryResponse)