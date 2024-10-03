import os
import pinecone
from langchain import PromptTemplate
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Pinecone as PC
from chatbot.models import chatbot_prompt
from django.shortcuts import render, redirect
from django.conf import settings
from .forms import PDFDocumentForm, PromptForm
from dashboard.utils import text_split
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

import warnings

# Ignore LangChain deprecation warnings
warnings.filterwarnings("ignore", category=UserWarning, module='langchain')

# Load environment variables
load_dotenv()

# Function to download embeddings
def download_hugging_face_embeddings():
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return embeddings

embeddings = download_hugging_face_embeddings()

# Initializing the Pinecone
def pinecone_init(text_chunks):
    pinecone_api_key = "bb9ceebb-5898-40ff-bd6d-3c50cb0bb9d9"
    import os
    from pinecone import Pinecone
    pc = Pinecone(api_key=pinecone_api_key)
    index = pc.Index("mr-analyzer")
    index_name="mr-analyzer"
    index.delete(delete_all=True)

    from langchain.vectorstores import Pinecone as PC
    docs_chunks = [t.page_content for t in text_chunks]
    pinecone_index = PC.from_texts(
        docs_chunks,
        embeddings,
        index_name='mr-analyzer'
    )
    print("Successfully initialized Pinecone and uploaded documents")

# Function to initialize Pinecone with data
def initialize_pinecone_with_data(text_chunks):
    try:
        pinecone_init(text_chunks)
        print("Pinecone initialization complete")
    except ValueError as e:
        print(f"Error: {e}")

# Set up document search using Pinecone
index_name = 'mr-analyzer'
docsearch = PC.from_existing_index(index_name, embeddings)

prompt_template = """
You are AI Sunny, the virtual assistant for OROSK, here to guide visitors with business growth, strategies, and our wide range of services. 
Your responsibilities include:
- Introducing yourself as AI Sunny when visitors ask for "Sunny," and directing them to Mr. Sunny for a personal conversation via WhatsApp at wa.me/+917719668289.
- Providing clear explanations that OROSK’s prices are competitively low due to constant improvements in quality, and if a visitor insists on a discount, politely decline by reiterating that prices may increase in the future due to these improvements.
- Directing any refund, complaint, or dissatisfaction queries to Mr. Sunny for personalized assistance on WhatsApp at wa.me/+917719668289.
- Providing full, direct links to any page or service requested on the website, ensuring users have easy access to the correct information.
- Offering information related to SEO services, strategies, and optimization techniques as outlined on the website.
- Ensuring responses remain concise and within a 250-word limit.

Context: {context}
Question: {question}
"""



PROMPT=PromptTemplate(template=prompt_template, input_variables=["context", "question"])
chain_type_kwargs={"prompt": PROMPT}

# Set up the Google Generative AI LLM
google_gemini_api = "AIzaSyAh5HbTtCHsO_ZWAtCtn_q5h2_Jw7tEfe8"
llm_model = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=google_gemini_api)

# Initialize the QA system
qa = RetrievalQA.from_chain_type(
    llm=llm_model, 
    chain_type="stuff", 
    retriever=docsearch.as_retriever(search_kwargs={'k': 2}),
    return_source_documents=True, 
    chain_type_kwargs=chain_type_kwargs
)
def get_response(query):
    user_input = query
    try:
        result=qa({"query": user_input})
        return result["result"]
    except Exception as e:
        return "Sorry, I couldn't process your request."
