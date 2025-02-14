import pandas as pd
import os
import base64
import io
import fitz  # PyMuPDF
from PIL import Image

def process_pdfs():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Read CSV file and process data
    csv_path = os.path.join(script_dir, '../urls.csv')
    data_df = pd.read_csv(csv_path)
    data_df['crs_title'] = data_df['crs_title'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)
    data_df['final_name'] = data_df['crs_id'].astype(str) + '_' + data_df['crs_title'].astype(str)
    first_folder_name = data_df['final_name'].to_list()
    
    # Get list of PDF file names
    directory_path_1 = os.path.join(script_dir, '../downloading_data/downloads')
    files = [f for f in os.listdir(directory_path_1) if os.path.isfile(os.path.join(directory_path_1, f))]
    
    # Create material directory
    material_dir = os.path.join(script_dir, 'material')
    os.makedirs(material_dir, exist_ok=True)
    
    for file, first_folder in zip(files, first_folder_name):
        save_folder = os.path.join(material_dir, first_folder)
        counter = 1
        original_save_folder = save_folder
        while os.path.exists(save_folder):
            save_folder = f"{original_save_folder}_{counter}"
            counter += 1
        os.makedirs(save_folder, exist_ok=True)
    
    # Store generated folders
    directory_path_2 = os.path.join(script_dir, '../extraction_data/material')
    folders = [f for f in os.listdir(directory_path_2) if os.path.isdir(os.path.join(directory_path_2, f))]
    
    # Create subfolders
    new_folders_list = data_df['file_id'].astype(str).to_list()[::-1]
    current_folder_paths = []
    
    for folder, new_folder in zip(folders, new_folders_list):
        folder1_path = os.path.join(directory_path_2, folder, new_folder)
        os.makedirs(folder1_path, exist_ok=True)
        os.makedirs(os.path.join(folder1_path, 'common'), exist_ok=True)
        os.makedirs(os.path.join(folder1_path, 'generated'), exist_ok=True)
        current_folder_paths.append(folder1_path)
    
    # Save images in common folder
    for common_folder, file in zip(current_folder_paths, files):
        file_path = os.path.join(directory_path_1, file)
        output_folder = os.path.join(common_folder, 'common')
        save_pdf_pages_as_images(file_path, output_folder)

    # Write current_folder_paths to a Python file
    with open(os.path.join(script_dir, 'folder_paths.py'), 'w') as file:
        file.write(f"current_folder_paths = {repr(current_folder_paths)}")
    

def pdf_page_to_base64(pdf_path: str, page_number: int):
    pdf_document = fitz.open(pdf_path)
    page = pdf_document.load_page(page_number - 1)
    pix = page.get_pixmap()
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

def save_pdf_pages_as_images(pdf_path: str, output_folder: str):
    os.makedirs(output_folder, exist_ok=True)
    pdf_document = fitz.open(pdf_path)
    for page_number in range(1, pdf_document.page_count + 1):
        base64_image = pdf_page_to_base64(pdf_path, page_number)
        image_data = base64.b64decode(base64_image)
        image_filename = os.path.join(output_folder, f"p{page_number}.png")
        with open(image_filename, 'wb') as img_file:
            img_file.write(image_data)
        print(f"Saved page {page_number} as {image_filename}")

# Run the function
# process_pdfs()