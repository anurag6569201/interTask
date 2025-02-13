### Importing Libraries

```
import pandas as pd
import os
import requests
```

* `pandas`: Used for reading and manipulating CSV data.
* `os`: Provides functions to handle file paths and directory operations.
* `requests`: Handles HTTP requests for downloading files.

### Load CSV Data

```
script_dir = os.path.dirname(os.path.abspath(__file__))

csv_path = os.path.join(script_dir, '../urls.csv')
data_df = pd.read_csv(csv_path)
```

* `script_dir`: Holds the directory path of the current script.
* `csv_path`: Specifies the path to the `urls.csv` file relative to the script directory.
* `pd.read_csv()`: Reads the CSV file into a DataFrame.

### Data Cleaning

```
data_df['file_name'] = data_df['file_name'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)
data_df['crs_title'] = data_df['crs_title'].apply(lambda x: x.replace(' ', '_') if isinstance(x, str) else x)
```

Replaces spaces with underscores in the `file_name` and `crs_title` columns to create clean file names.

### Create Final Name Column

```data_df['final_name']
data_df['final_name'] = data_df['crs_id'].astype(str) + '_' + data_df['crs_title'].astype(str) + '_' + data_df['file_id'].astype(str) + '_' + data_df['file_name']
```

Combines several columns (`crs_id`, `crs_title`, `file_id`, `file_name`) to create a unique file name.

### Create Dictionary of URLs

```list_of_urls_to_download
list_of_urls_to_download = dict(zip(data_df['final_name'], data_df['file_url']))
```

Creates a dictionary where keys are the constructed file names, and values are the URLs to download.

### Create Save Folder

```
save_folder = os.path.join(script_dir, "downloads")
os.makedirs(save_folder, exist_ok=True)
```

Defines the directory to save PDF files and creates it if it doesn't exist.

### Function to Download PDFs

```
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
```


* Downloads a PDF file from the provided URL and saves it to the specified path.
* Uses `requests.get()` for the download and writes the file in chunks to handle large files.
* Catches and logs exceptions for any request errors.

### Download Files

```
for final_name, url in list_of_urls_to_download.items():
    save_path = os.path.join(save_folder, final_name + ".pdf")
    download_pdf(url, save_path)
```

Iterates over the dictionary and downloads each PDF, saving it with the generated file name.

### Completion Message

```
print("Download process completed.")
```

* Indicates that the download process is complete.
