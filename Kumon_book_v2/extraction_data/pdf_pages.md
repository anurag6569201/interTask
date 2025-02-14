### Importing Required Libraries

```
import pandas as pd
import os
import base64
import io
import fitz  # PyMuPDF
from PIL import Image
```

* `pandas`: For reading and processing CSV files.
* `os`: For directory operations such as path handling and file checks.
* `base64`: Encoding and decoding binary data.
* `io`: Handling byte streams.
* `fitz (PyMuPDF)`: PDF manipulation and image extraction.
* `PIL (Pillow)`: Image manipulation.

### Setting Up Script Directory

`script_dir = os.path.dirname(os.path.abspath(__file__))`

Retrieves the absolute path of the script directory to use relative paths for file operations

### Reading and Processing the CSV File

```
csv_path = os.path.join(script_dir, '../urls.csv')
data_df = pd.read_csv(csv_path)
data_df['crs_title'] = data_df['crs_title'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)
data_df['final_name'] = data_df['crs_id'].astype(str) + '_' + data_df['crs_title'].astype(str)
```

* Reads the CSV file containing course information.
* Replaces spaces in course titles with underscores to create valid folder names.
* Combines course IDs and titles to generate unique folder names.

### Extracting Folder Names

`first_folder_name = data_df['final_name'].to_list()`

### Retrive Pdf File Names

```
directory_path_1 = os.path.join(script_dir, '../downloading_data/downloads')
files = [f for f in os.listdir(directory_path_1) if os.path.isfile(os.path.join(directory_path_1, f))]
print("PDF Files:", files)
```

* Lists all PDF files in the `downloads` directory.

### Creating Folders for Courses

```
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
    print(f"Created folder: {save_folder}")
```

* Creates a material directory and subfolders for each course.
* Ensures unique folder names by appending counters if a folder already exists.

### Retrieving Generated Folder Names

```
directory_path_2 = os.path.join(script_dir, '../extraction_data/material')
folders = [f for f in os.listdir(directory_path_2) if os.path.isdir(os.path.join(directory_path_2, f))]
print("Generated Folders:", folders)
```

* Retrieves existing folder names from the material directory.

### Creating Subfolders for Course Materials

```
new_folders_list = data_df['file_id'].astype(str).to_list()[::-1]
print("New Folder List:", new_folders_list)

current_folder_paths = []
for folder, new_folder in zip(folders, new_folders_list):
    folder1_path = os.path.join(directory_path_2, folder, new_folder)
    os.makedirs(folder1_path, exist_ok=True)

    common_folder_path = os.path.join(folder1_path, 'common')
    os.makedirs(common_folder_path, exist_ok=True)

    generated_folder_path = os.path.join(folder1_path, 'generated')
    os.makedirs(generated_folder_path, exist_ok=True)

    print(f"Created folder: {folder1_path}")
    current_folder_paths.append(folder1_path)
```

Creates subfolders `common` and `generated` within each course directory.

### PDF Page to Base64 Conversion

```
def pdf_page_to_base64(pdf_path: str, page_number: int):
    pdf_document = fitz.open(pdf_path)
    page = pdf_document.load_page(page_number - 1)  # input is one-indexed
    pix = page.get_pixmap()
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")

    return base64.b64encode(buffer.getvalue()).decode("utf-8")
```

Converts a specific PDF page to a base64-encoded PNG image.

### Saving PDF Pages as Images

```
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
```

Saves all pages of a given PDF as PNG images in the specified output folder.

### Saving PDF Images in `common` Folder

```
for common_folder, file in zip(current_folder_paths, files):
    file_path = os.path.join(directory_path_1, file)
    output_folder = os.path.join(common_folder, 'common')

    save_pdf_pages_as_images(file_path, output_folder)
```

Iterates through PDF files and stores page images in the `common` folder within each course directory.
