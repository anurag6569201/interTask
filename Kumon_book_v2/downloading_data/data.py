import pandas as pd
import os
import requests

def download_pdfs():
    # Load CSV data
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, '../urls.csv')
    data_df = pd.read_csv(csv_path)


    # Data cleaning for filenames and titles
    data_df['file_name'] = data_df['file_name'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)
    data_df['crs_title'] = data_df['crs_title'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)

    # Create the final name for files
    data_df['final_name'] = data_df['crs_id'].astype(str) + '_' + data_df['crs_title'].astype(str) + '_' + data_df['file_id'].astype(str) + '_' + data_df['file_name']

    # Create a dictionary of URLs to download
    list_of_urls_to_download = dict(zip(data_df['final_name'], data_df['file_url']))

    # Folder to save PDFs
    save_folder = os.path.join(script_dir, "downloads")
    os.makedirs(save_folder, exist_ok=True)

    # Function to download PDF files
    def download_pdf(url, save_path):
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            with open(save_path, "wb") as file:
                for chunk in response.iter_content(chunk_size=8192):
                    file.write(chunk)
            
            print(f"Downloaded: {save_path}")
        except requests.exceptions.RequestException as e:
            print(f"Failed to download {url}: {e}")

    # Download all files
    for final_name, url in list_of_urls_to_download.items():
        save_path = os.path.join(save_folder, final_name + ".pdf")
        download_pdf(url, save_path)

    print("Download process completed.")
