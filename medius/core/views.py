import os
import pandas as pd
from django.core.files.storage import FileSystemStorage
from django.shortcuts import render
from io import BytesIO

def index(request):
    if request.method == 'POST' and request.FILES['file']:
        # uploading and saving the data
        uploaded_file = request.FILES['file']
        file_format = request.POST.get('contact_method')
        fs = FileSystemStorage()
        filename = fs.save(uploaded_file.name, uploaded_file)
        file_path = fs.path(filename)
        
        # Process the file
        result_df, output_csv_path, output_xlsx_path = process_file(file_path, file_format, fs)
        
        # Render the result in a result.html file
        context = {
            'result_data': result_df.to_dict(orient='records'),
            'output_csv_path': output_csv_path,
            'output_xlsx_path': output_xlsx_path
        }
        return render(request, 'core/result.html', context)
    
    # if not success back to home page index.html
    return render(request, "core/index.html")


def process_file(file_path, file_format, fs):
    # reading the data
    if file_format == 'csv':
        df = pd.read_csv(file_path)
    elif file_format == 'excel':
        df = pd.read_excel(file_path)

    # Ensuring the required columns are present
    required_columns = ['Cust State', 'DPD']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Uploaded file is missing required columns: {', '.join(missing_columns)}")

    # Extract and process the data
    state_dpd_counts = df.groupby(['Cust State', 'DPD']).size().reset_index(name='count')
    odd_dpd_counts = state_dpd_counts[state_dpd_counts['DPD'] % 2 != 0]
    
    # Sort the data alphabetically by states names
    odd_dpd_counts = odd_dpd_counts.sort_values(by=['Cust State', 'DPD'])
    
    # Rename the (Cust State) column to (Cust_State)
    odd_dpd_counts.rename(columns={'Cust State': 'Cust_State'}, inplace=True)
    
    # Save the result as CSV
    output_csv_filename = 'output.csv'
    output_csv_path = os.path.join(fs.location, output_csv_filename)
    odd_dpd_counts.to_csv(output_csv_path, index=False)
    
    # Save the result as XLSX
    output_xlsx_filename = 'output.xlsx'
    output_xlsx_path = os.path.join(fs.location, output_xlsx_filename)
    output_xlsx_stream = BytesIO()
    with pd.ExcelWriter(output_xlsx_stream, engine='xlsxwriter') as writer:
        odd_dpd_counts.to_excel(writer, index=False, sheet_name='Sheet1')
        writer.book.close()

    with open(output_xlsx_path, 'wb') as f:
        f.write(output_xlsx_stream.getvalue())
    
    # returning all the results to the function
    return odd_dpd_counts, fs.url(output_csv_filename), fs.url(output_xlsx_filename)
