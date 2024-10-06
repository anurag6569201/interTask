from django.shortcuts import render, redirect
from django.conf import settings
from .models import chatbot_prompt,PDFDocument
from .forms import PDFDocumentForm, PromptForm
import os
from chatbot.llm import get_response
from dashboard.utils import text_split
import json
import logging
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
logger = logging.getLogger(__name__)

def chatbot(request):
    latest_doc = PDFDocument.objects.order_by('-uploaded_at').first()
    prompt = chatbot_prompt.objects.order_by('uploaded_at').first()
    if request.method == 'POST':
        form = PDFDocumentForm(request.POST, request.FILES)
        if form.is_valid():
            pdfs_path = os.path.join(settings.MEDIA_ROOT, 'pdfs/')
            for filename in os.listdir(pdfs_path):
                file_path = os.path.join(pdfs_path, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
            form.save()
            text_chunks = text_split()
            print("Successfully created pinecone document")
            return redirect("chatbot:chatbot")
        
        prompt_form = PromptForm(request.POST, instance=prompt)
        if prompt_form.is_valid():
            prompt_form.save()

    else:
        form = PDFDocumentForm()
        prompt_form = PromptForm(instance=prompt)

    context = {
        'form': form,
        'prompt_form': prompt_form,
        'prompt': prompt,
        'latest_doc':latest_doc,
    }
    return render(request, 'chatbot/chatbot.html', context)


@csrf_exempt
def send_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_message = data.get('message', '')
            if user_message:
                response_message = get_response(user_message)
                return JsonResponse({"reply": response_message})
            return JsonResponse({"reply": "I didn't understand that. Could you please rephrase?"})
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return JsonResponse({"error": "An unexpected error occurred."}, status=500)
    return JsonResponse({"error": "Invalid request method."}, status=405)