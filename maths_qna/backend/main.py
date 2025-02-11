from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Optional

from llm import process_files, image_base

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store uploaded files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/process_data/")
async def process_data(
    text: Optional[str] = Form(""),
    page_range: Optional[int] = Form(0),
    file: Optional[UploadFile] = File(None),  # Fix: Set default to None
    image: Optional[UploadFile] = File(None),  # Fix: Set default to None
):
    try:
        response_data = {}

        # Process PDF if uploaded
        pdf_images = []
        if file is not None:
            file_location = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_location, "wb+") as file_object:
                file_object.write(file.file.read())
            print(f"File saved to {file_location}")

            if page_range:
                pdf_images = process_files(file_location, page_range)
                response_data["pdf_processed"] = f"Extracted {len(pdf_images)} pages."
            else:
                response_data["pdf_warning"] = "PDF uploaded but no page range provided."

        question_image = None
        if image is not None:
            image_location = os.path.join(UPLOAD_DIR, image.filename)
            with open(image_location, "wb+") as image_object:
                image_object.write(image.file.read())
            print(f"Image saved to {image_location}")
            question_image = image_location

        # Ensure at least one valid input exists
        if text or pdf_images or question_image:
            llm_response = image_base(pdf_images, question_image, text)
            response_data["llm_response"] = llm_response
        else:
            response_data["message"] = "No valid inputs provided."

        print(response_data)
        return response_data

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
