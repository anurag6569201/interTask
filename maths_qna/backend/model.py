import os  
import base64
from openai import AzureOpenAI  

# Azure OpenAI configuration
endpoint = "https://ai-anuragsingh65692019195ai682501652060.openai.azure.com/" 
deployment = "gpt-4o"
subscription_key = "ApKKNDsSgzuAwzeg0YmI97hia2uygeg8bQ7CheJt7jiP80BMxkRqJQQJ99ALACHYHv6XJ3w3AAAAACOGHz2s"

# Initialize Azure OpenAI Service client
client = AzureOpenAI(  
    azure_endpoint=endpoint,  
    api_key=subscription_key,  
    api_version="2024-05-01-preview",
)

# Dictionary to maintain session history
session_memory = {}

def llm_model(session_id, image_data, question_base64_image, question):
    """
    Handles session-based interaction with Azure OpenAI.

    :param session_id: Unique identifier for user session
    :param image_data: List of base64-encoded images for context
    :param question_base64_image: Base64-encoded image of the question
    :param question: Text-based question
    :return: JSON-formatted response from OpenAI
    """
    
    # Initialize session memory if not exists
    if session_id not in session_memory:
        session_memory[session_id] = [
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": """You are an expert in maths and you are favorite of all the students. You are known for your problem-solving skills. You are given a set of problems to solve based on the theories and materials given. You have to provide the solutions in JSON format with question, answer, solution step by step, hints, and ensure that you read the question carefully, considering all signs and details.
                            sample response formate:
                            [{
                                "question": "",
                                "answer": "",
                                "solution": "",
                                "hints": ""
                            }]
                        """
                    }
                ]
            }
        ]

    # Append user input
    session_memory[session_id].append({
        "role": "user",
        "content": [
            *[
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image}"}
                } for image in image_data
            ],
            {
                "type": "image_url",
                "image_url": {"url": f"data:image/jpeg;base64,{question_base64_image}"}
            },
            {
                "type": "text",
                "text": question
            }
        ]
    })

    # Generate completion
    completion = client.chat.completions.create(
        model=deployment,
        messages=session_memory[session_id],
        max_tokens=2000,
        temperature=0.7,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=False
    )

    # Store response in session history
    response = completion.to_dict()['choices'][0]['message']['content']
    session_memory[session_id].append({
        "role": "assistant",
        "content": response
    })

    # Extract JSON response
    start_index = response.find('```json\n') + len('```json\n')
    end_index = response.find('```', start_index)
    json_response_str = response[start_index:end_index].strip()

    return json_response_str

