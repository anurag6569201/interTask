import base64
import io

import fitz
from PIL import Image
import os
from model import llm_model

image_data = []

def pdf_page_to_base64(pdf_path: str, page_number: int):
    pdf_document = fitz.open(pdf_path)
    page = pdf_document.load_page(page_number - 1)  # input is one-indexed
    pix = page.get_pixmap()
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")

    return base64.b64encode(buffer.getvalue()).decode("utf-8")

def process_files(file,range_value):
    for page_number in range(0, range_value):  # pages 0 to 5
        base64_image = pdf_page_to_base64(file, page_number)
        image_data.append(base64_image)
        return image_data


# Load environment variables
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv('AZURE_OPENAI_API_KEY')
ENDPOINT = "https://ai-anuragsingh65692019195ai682501652060.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview"


def image_base(pdf_images,image_path,question):
    local_image_data = pdf_images if pdf_images else []
    
    if not question:
        question = "Solve this problem"  # Default question

    question_base64_image = None

    question_image_path = image_path
    question_base64_image = pdf_page_to_base64(question_image_path, 0)
    session_id="user1234"
    response=llm_model(session_id,local_image_data,question_base64_image,question)
    return response