# core/views.py
from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
import pytesseract
from PIL import Image

def index(request):
    text = None
    if request.method == 'POST' and request.FILES['file']:
        uploaded_file = request.FILES['file']
        fs = FileSystemStorage()
        file_path = fs.save(uploaded_file.name, uploaded_file)
        file_url = fs.url(file_path)

        # Use PIL to open the image
        img = Image.open(fs.path(file_path))

        # Use pytesseract to extract text
        text = pytesseract.image_to_string(img)

        # Optionally, you can delete the file after processing
        fs.delete(file_path)

    return render(request, 'core/index.html', {'text': text})
