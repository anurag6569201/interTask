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