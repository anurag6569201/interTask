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
endpoint = "https://ai-anuragsingh65692019195ai682501652060.openai.azure.com/"
deployment = "gpt-4o"
subscription_key = "ApKKNDsSgzuAwzeg0YmI97hia2uygeg8bQ7CheJt7jiP80BMxkRqJQQJ99ALACHYHv6XJ3w3AAAAACOGHz2s"


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
