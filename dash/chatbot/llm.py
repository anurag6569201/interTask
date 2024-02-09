import os
import pandas as pd
from dotenv import load_dotenv
from langchain_experimental.agents import create_csv_agent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from django.conf import settings
from concurrent.futures import ThreadPoolExecutor, TimeoutError
from chatbot.models import QueryResponse, PDFDocument
import uuid

# Load environment variables
load_dotenv()
google_gemini_api = os.getenv("GOOGLE_API_KEY")

# Initialize the language model
llm_model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=google_gemini_api)

# Function to dynamically get CSV paths
def get_csv_paths():
    links_csv = PDFDocument.objects.filter(file_type='links').first()
    text_csv = PDFDocument.objects.filter(file_type='text').first()

    output_csv_path = os.path.join(settings.MEDIA_ROOT, links_csv.pdf_file.name)
    textual_csv_path = os.path.join(settings.MEDIA_ROOT, text_csv.pdf_file.name)
    return output_csv_path, textual_csv_path

# Memory for conversation context
memory = {}

def get_memory_key(user_id):
    return f"memory_{user_id}"

def save_to_memory(user_id, conversation_context):
    memory[get_memory_key(user_id)] = conversation_context

def get_from_memory(user_id):
    return memory.get(get_memory_key(user_id), "")

def is_relevant_query(user_input):
    relevant_keywords = [
        "SEO services", 
        "business growth strategies", 
        "pricing packages", 
        "refund policies", 
        "customer complaints", 
        "local business SEO", 
        "backlink building services", 
        "high DA backlinks", 
        "dofollow backlinks", 
        "daily link building", 
        "guest blog posting", 
        "forum link building", 
        "web 2.0 backlinks", 
        "classified ad backlinks", 
        "local business citation", 
        "image submission links", 
        "infographic submission services", 
        "PDF/PPT submissions", 
        "directory submissions", 
        "website development services", 
        "content writing services", 
        "press release services", 
        "Google Ads PPC management",
        "links", 
        "URL", 
        "service links", 
        "SEO links", 
        "pricing links", 
        "backlink URLs"
    ]
    
    return any(keyword.lower() in user_input.lower() for keyword in relevant_keywords)

# Function to create an agent with memory handling
def create_agent_with_memory():
    def handle_request(user_id, user_input):
        # Retrieve context from memory
        context = get_from_memory(user_id)
        
        # Get the dynamically updated CSV paths
        output_csv, textual_csv = get_csv_paths()

        # Create CSV agents for links
        links_agent = create_csv_agent(llm_model, output_csv, verbose=True, allow_dangerous_code=True, query_type="lookup", result_limit=10, timeout=10)

        # Handle relevant queries
        if is_relevant_query(user_input):
            detailed_query_for_links = f"""
            Please provide the complete and direct links without any truncation, in this format:
            <a href="FULL_URL" target="_blank">Link name</a>
            {user_input}
            """

            detailed_query_for_text = PromptTemplate(
                input_variables=["user_input", "text_content"],
                template="""You are AI Sunny from OROSK’s business growth and SEO services. Your task is to answer all questions related to the business and OROSK services, incorporating links and textual data effectively.
                For refund, dissatisfaction, or complaint queries, direct the customer to chat with Mr. Sunny through WhatsApp link: https://wa.me/+917719668289.
                Answer within 90 words, and provide links only if relevant.
                context : {text_content}
                {user_input}
                """
            )

            with ThreadPoolExecutor() as executor:
                try:
                    # Concurrently execute agents with a shorter timeout
                    links_future = executor.submit(links_agent.run, {"input": detailed_query_for_links})
                    text_content = pd.read_csv(textual_csv).to_string()
                    text_prompt = detailed_query_for_text.format(user_input=user_input, text_content=text_content)
                    text_response = llm_model.predict(text_prompt)

                    links_response = links_future.result(timeout=10)
                except TimeoutError:
                    links_response = "Links agent timed out. Partial results returned." if not links_future.done() else links_future.result()
                except Exception as e:
                    return {"error": f"An error occurred: {str(e)}"}

            # Combine responses
            combined_response = f"{links_response}\n{text_response}"
            save_to_memory(user_id, f"{context}\n{user_input}\n{combined_response}")

            # Final response prompt
            prompt_template = PromptTemplate(
                input_variables=["user_input", "combined_response"],
                template="""User query: {user_input}
                Context: {combined_response}
                Use this information according to user_input and the combined response to give an answer.
                If there are links, make sure to include them in the final response as much as possible with this format Link Keyword - <a href="FULL_URL" target="_blank">FULL_URL</a>.
                If there are no links, provide a summary or answer.
                If there link from combined_response make sure to include them in the final response without explaining the links to the user
                """
            )
            data_prompt = prompt_template.format(user_input=user_input, combined_response=combined_response)
            llm_response = llm_model.predict(data_prompt)
            QueryResponse.objects.create(
                user_id=user_id,
                user_query=user_input,
                ai_response=llm_response
            )
            return {"query": user_input, "response": llm_response}

        # Handle non-relevant queries
        else:
            fallback_prompt = PromptTemplate(
                input_variables=["user_input"],
                template="""For non-link related queries, guide users according to OROSK's business practices.
                Answer within 150 words, and provide links only if relevant.
                {user_input}
                {text_content}
                """
            )
            text_content = pd.read_csv(textual_csv).to_string()
            fallback_data = fallback_prompt.format(user_input=user_input, text_content=text_content)
            llm_response = llm_model.predict(fallback_data)
            QueryResponse.objects.create(
                user_id=user_id,
                user_query=user_input,
                ai_response=llm_response
            )
            save_to_memory(user_id, f"{context}\n{user_input}\n{llm_response}")
            return {"query": user_input, "response": llm_response}

    return handle_request

def get_random_user_id():
    return str(uuid.uuid4())

# Usage
user_id = get_random_user_id()
handle_request = create_agent_with_memory()

def get_response(message):
    response_data = handle_request(user_id, message)
    return response_data.get('response', "Error processing request")
