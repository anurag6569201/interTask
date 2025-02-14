import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(script_dir)

from downloading_data.data import process1
from extraction_data.pdf_pages import process_pdfs
from extraction_data.calculation import process_images
from extraction_data.bindup import images_to_pdf

process1()
process_pdfs()
process_images()
images_to_pdf()