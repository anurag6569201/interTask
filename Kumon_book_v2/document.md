# Kumon Generation v2

## Project Overview

Kumon Generation v2 is a structured pipeline designed to:

- Download files from a given set of URLs.
- Extract pages from PDFs and organize them into structured directories.
- Process extracted pages and generate new content.
- Merge generated images into finalized PDF files.

## Directory Structure

```bash

Kumon_generation_v2
  | -- downloading_data
  |     | -- data.py           # Downloads files from URLs
  |     | -- downloads         # Directory to store downloaded files
  |
  | -- extraction_data
  |     | -- a4_page.html      # Generated HTML content
  |     | -- bindup.py         # Merges processed images into PDFs
  |     | -- calculation.py    # Processes extracted images
  |     | -- folder_paths.py   # Manages directory paths
  |     | -- pdf_pages.py      # Extracts pages from PDFs
  |     | -- usage.csv         # Save all the usage by the gpt tokens 
  |     | -- material
  |           | -- folders      # Organized extracted content
  |           | -- combined_pdf # Final compiled PDFs
  |
  | -- run.py                  # Main execution script
  | -- urls.csv                 # Contains URLs and file metadata
```

## 1. URLs File (`urls.csv`)

This file contains metadata and download links for files.

**Example:**

```
crs_id,crs_title,file_id,file_name,file_url
233,I Polynomials,2546,Basics for Level 1 Mathematics,https://shikhyaprod.s3.amazonaws.com/odia/CourseResource/233/files/2546/2546_OE993JZkqg.pdf
233,I Polynomials,2547,Multiplication of Polynomials,https://shikhyaprod.s3.amazonaws.com/odia/CourseResource/233/files/2547/2547_oZtLl7cV9f.pdf
```

## 2. `run.py`

This script orchestrates the entire workflow by:

- Downloading files
- Extracting pages from PDFs
- Processing images
- Combining them into final PDFs

## 3. Components Breakdown

### 3.1. Downloading Files (`downloading_data/data.py`)

This script reads `urls.csv` and downloads files into the `downloads` folder.

```python
import pandas as pd
import os
import requests

# Load CSV data
script_dir = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(script_dir, '../urls.csv')
data_df = pd.read_csv(csv_path)

# Data cleaning for filenames and titles
data_df['file_name'] = data_df['file_name'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)
data_df['crs_title'] = data_df['crs_title'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)

# Create final name column
print(data_df['file_name'])

# Show a sample for debugging
data_df.sample(n=2)

# Create the final name for files
data_df['final_name'] = data_df['crs_id'].astype(str) + '_' + data_df['crs_title'].astype(str) + '_' + data_df['file_id'].astype(str) + '_' + data_df['file_name']

# Create a dictionary of URLs to download
list_of_urls_to_download = dict(zip(data_df['final_name'], data_df['file_url']))

# Folder to save PDFs
save_folder = os.path.join(script_dir, "downloads")

os.makedirs(save_folder, exist_ok=True)

# Function to download PDF files
def download_pdf(url, save_path):
    """Download a PDF file from a given URL and save it."""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()  # Raise an error for bad responses (4xx, 5xx)
  
        with open(save_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
  
        print(f"Downloaded: {save_path}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}: {e}")

# Download all files
def process1():
    for final_name, url in list_of_urls_to_download.items():
        save_path = os.path.join(save_folder, final_name + ".pdf")  # Use the key as the filename
        download_pdf(url, save_path)

    print("Download process completed.")
```

### 3.2. Extracting PDF Pages (`extraction_data/pdf_pages.py`)

This script extracts pages from PDFs and organizes them into folders.

```
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
```

### 3.3. Image Processing (`extraction_data/calculation.py`)

This script processes extracted images, generating new variations and saving them as `a4_page.html`.

```
import os
import sys
import time
import json
import glob
import base64
import io
import pandas as pd
import fitz
from PIL import Image

script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from openai import AzureOpenAI


# Azure OpenAI Config
endpoint = ""
deployment = ""
subscription_key = ""


def pdf_page_to_base64(pdf_path: str, page_number: int):
    pdf_document = fitz.open(pdf_path)
    page = pdf_document.load_page(page_number - 1)
    pix = page.get_pixmap()
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

def get_image_path(img_path):
    return pdf_page_to_base64(img_path, 0)

def llm_bot(question_base64_image):
    client = AzureOpenAI(
        azure_endpoint=endpoint,
        api_key=subscription_key,
        api_version="2024-05-01-preview",
    )
    chat_prompt = [
        {
            "role": "system",
            "content": [
                {
                    "type": "text",
                    "text": """ I have an image of a scanned A4 paper containing questions. Your task is to generate HTML code to replicate after understanding it and make sure the questions should be unique as well as similar to them dont go beyond the topic make sure the level should be same and the response should be in only dictionary and make sure no (backslash n) \n use only div. 
                        Your response must be a valid Python dictionary, with no extra text, explanations, or formatting. 
                        The response should exactly match the structure:
                        Respond ONLY with a clean dictionary. No markdown (```), no "python", no "json", no explanations.  
                        Your response should strictly follow this structure: 
                        {"title": "<p class=\"title\">Simple arithmetic questions</p>","questions": "<div class=\"question\"><div><span class=\"question-number\">(1)</span> (2a + b)(3x + 2y) =</div><div><span class=\"question-number\">(2)</span> (a - b)(c + d) =</div><div><span class=\"question-number\">(3)</span> (2a - b)(3x + 2y) =</div></div>"}
                        *your response should be clean it wont have any these things ```,python,\n,```python
                        *make sure same number of things to create
                        **🚫 DO NOT include:**  
                        - Markdown (` ``` `), "python", "json", or extra text.  
                        - Any `\n`, `\t`, or escape sequences.  
                        - Additional explanations or formatting.  
                        *Include mathematical expressions in LaTeX format (using MathJax for rendering) it must be :
                    """
                }
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{question_base64_image}"}
                }
            ]
        }
    ] 
    completion = client.chat.completions.create(
        model=deployment,
        messages=chat_prompt,
        max_tokens=2000,
        temperature=0.7,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0
    )
    return completion

def generate_image_by_llm_and_save(response_dict, destination, image_name):
    html_content = f"""
    <!DOCTYPE html>  
    <html lang="en">  
    <head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  
    <title>Replica of A4 Paper</title>  
    <script type="text/javascript" async
      src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
    </script>

    <style>  
        * {{  
        margin: 0;  
        padding: 0;  
        box-sizing: border-box;  
        }}  
        body {{  
        display: flex;  
        justify-content: center;  
        align-items: center;  
        background-color: #f4f4f4;  
        font-family: 'Times New Roman', Times, serif;  
        }}  
        .a4-page {{  
        width: 210mm;
            height: 297mm;
            background: white;
            padding: 10mm;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border: 1px solid #ddd;
            display: flex;
            flex-direction: column; 
        }}  
        .title {{  
        font-size: 24px;  
        font-weight: bold;  
        text-align: left;  
        }}  
        .question {{  
            font-size: 18px;
            padding-top: 10px;
            line-height: 1.8;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }}  
        .question span {{  
        font-weight: bold;  
        }}  
        .question-number {{  
        margin-right: 10px;  
        }}  
    </style>  
    </head>  
    <body>  
    <div class="a4-page">  
        {response_dict['title']}
        {response_dict['questions']}
    </div>  
    </body>  
    </html>
    """

    # Save HTML to a file
    html_file = os.path.join(script_dir, "./a4_page.html")
    with open(html_file, "w") as file:
        file.write(html_content)

    # Set up Selenium WebDriver
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Run in headless mode
    options.add_argument("--window-size=800,1200")  # Ensure the window fits the A4 page
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    driver.get(f"file:///{html_file}")
    time.sleep(2)
    driver.execute_script("document.body.style.zoom='0.94'")
    time.sleep(1)
    screenshot_path = os.path.join(destination, f"{image_name}.png")
    driver.save_screenshot(screenshot_path)
    driver.quit()

def process_images():
    from folder_paths import current_folder_paths
    usage_records = []
    for folder_images in current_folder_paths:
        image_paths = folder_images + '/common/*'
        generated_image_path = folder_images + '/generated/'
        for item in glob.glob(image_paths):
            filename_with_extension = os.path.basename(item)
            filename, _ = os.path.splitext(filename_with_extension)
            base64_of_images = get_image_path(item)
            completion = llm_bot(base64_of_images)
            response = completion.to_dict()['choices'][0]['message']['content']
            response_usage = completion.to_dict()['usage']
            usage_records.append({
                "filename": filename,
                "completion_tokens": response_usage.get('completion_tokens', 0),
                "prompt_tokens": response_usage.get('prompt_tokens', 0),
                "total_tokens": response_usage.get('total_tokens', 0),
            })
            response_dict = json.loads(response)
            generate_image_by_llm_and_save(response_dict, generated_image_path, filename)
            print('Generated image',filename)
        print('Generating another file')
  
    new_df_usage = pd.DataFrame(usage_records)
    new_df_usage.describe().to_csv('usage.csv', index=True)
    prompt_token_cost = 0.000216
    completion_token_cost = 0.00086551

    total_prompt_tokens = new_df_usage['prompt_tokens'].sum()
    total_completion_tokens = new_df_usage['completion_tokens'].sum()
    total_cost = (total_prompt_tokens * prompt_token_cost) + (total_completion_tokens * completion_token_cost)

    print(f"Total Tokens Used: {total_prompt_tokens + total_completion_tokens}")
    print(f"Total Spend: Rs {total_cost:.4f}")

# Run the function
# process_images()

```

### 3.4. Merging PDFs (`extraction_data/bindup.py`)

This script collects processed images and merges them into a final PDF stored in `material/combined_pdf/`.

```
import os
import pandas as pd
from PIL import Image
import sys
import os
from PIL import Image

script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

from folder_paths import current_folder_paths
saving_folder = os.path.join(script_dir,'./material/combined_pdf')
def images_to_pdf():
    # Load and preprocess CSV data
    csv_path = os.path.join(script_dir, '../urls.csv')
    data_df = pd.read_csv(csv_path)

    data_df['file_name'] = data_df['file_name'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)
    data_df['crs_title'] = data_df['crs_title'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)
    print(data_df['file_name'])

    for folder_name, file_name in zip(current_folder_paths, data_df['file_name']):
        folder_name = os.path.join(folder_name, 'generated')
        print(folder_name)

        # Get all images sorted in order
        image_files = sorted(
            [f for f in os.listdir(folder_name) if f.endswith(".png")], 
            key=lambda x: int(x[1:-4])
        )

        if not image_files:
            print("No images found in the folder.")
        else:
            output_pdf = os.path.join(saving_folder, f"{file_name}.pdf") # Ensure output path is set before saving
      
            # Open first image
            first_image = Image.open(os.path.join(folder_name, image_files[0]))
            image_list = [Image.open(os.path.join(folder_name, img)).convert("RGB") for img in image_files[1:]]

            # Save as PDF
            first_image.save(output_pdf, save_all=True, append_images=image_list)
            print(f"PDF created successfully: {output_pdf}")


images_to_pdf()
```

## 4. usage.csv

After completing run.py task it will genrate the token usage and some usefull insights

```
,completion_tokens,prompt_tokens,total_tokens
count,4.0,4.0,4.0
mean,333.25,665.0,998.25
std,87.19470549675977,0.0,87.19470549675977
min,214.0,665.0,879.0
25%,309.25,665.0,974.25
50%,348.0,665.0,1013.0
75%,372.0,665.0,1037.0
max,423.0,665.0,1088.0
```

## Running the Project

##### For running the programme

```bash
source venv/bin/activate
cd Kumon_generation_v2
python run.py
```

##### For putting new data to work

```
cd Kumon_generation_v2
nano urls.csv
ctrl + k  # all code
ctrl + v  # add new data
```

##### Remove everything before new run

```
cd downloading_data/
rm -rf downloads/  # delete old download folder to avoid repetition
cd extraction_data/
rm -rf material/  # delete whole material folder after full work for non repetition on next run.py
```

This will execute the full workflow from downloading files to generating final PDFs.
