from django.shortcuts import render, redirect,get_object_or_404
from django.conf import settings
from .models import PDFDocument,QueryResponse
from .forms import PDFDocumentForm, PromptForm
import os
from chatbot.llm import get_response
from dashboard.utils import text_split
import json
import logging
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
logger = logging.getLogger(__name__)
import csv
from django.db.models import Min


def chatbot(request):
    latest_doc = PDFDocument.objects.order_by('-uploaded_at').all()
    links_csv = PDFDocument.objects.filter(file_type='links').first()
    text_csv = PDFDocument.objects.filter(file_type='text').first()

    first_chats = QueryResponse.objects.values('user_id').annotate(first_query=Min('created_at'))

    # Fetch all chats, ordered by user and timestamp, for those users
    grouped_chats = {}
    for entry in first_chats:
        user_id = entry['user_id']
        user_chats = QueryResponse.objects.filter(user_id=user_id).order_by('created_at')

        if user_chats.exists():
            grouped_chats[user_id] = list(user_chats)

    if request.method == 'POST':
        form = PDFDocumentForm(request.POST, request.FILES)
        if form.is_valid():
            file_type = form.cleaned_data['file_type']

            # Remove the old file if already exists
            existing_file = PDFDocument.objects.filter(file_type=file_type).first()
            if existing_file:
                if os.path.isfile(existing_file.pdf_file.path):
                    os.remove(existing_file.pdf_file.path)
                existing_file.delete()

            form.save()
            print("Successfully submitted document")
            return redirect("chatbot:chatbot")

    else:
        form = PDFDocumentForm()
    
    links_csv = PDFDocument.objects.filter(file_type='links').first()
    text_csv = PDFDocument.objects.filter(file_type='text').first()
    

    context = {
        'form': form,
        'latest_doc': latest_doc,
        'links_csv': links_csv,
        'text_csv': text_csv,
        'grouped_chats': grouped_chats,
    }
    return render(request, 'chatbot/chatbot.html', context)

def getting_paths(request):
    pass


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




def edit_csv(request, pk):
    document = get_object_or_404(PDFDocument, pk=pk)

    if request.method == 'POST':
        csv_data = request.POST.get('csv_data')
        if csv_data:
            csv_file_path = document.pdf_file.path
            # Save the updated CSV data back to the file
            with open(csv_file_path, 'w', newline='') as csv_file:
                csv_file.write(csv_data)  # Write new content to the file
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'error': 'No CSV data received'}, status=400)

    return render(request, 'chatbot/edit_csv.html', {'document': document})


def fetch_csv_data(request, pk):
    document = get_object_or_404(PDFDocument, pk=pk)
    csv_file_path = document.pdf_file.path

    # Read the CSV file
    try:
        with open(csv_file_path, 'r') as file:
            csv_content = file.read()
        return JsonResponse({'csv_content': csv_content})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)