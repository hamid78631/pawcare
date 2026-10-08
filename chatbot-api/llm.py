import os 
from dotenv import load_dotenv
from openai import OpenAI

from prompt import SYSTEM_PROMPT


load_dotenv()  # Load environment variables from .env file

client = OpenAI(
    base_url= os.getenv("BASE_URL_GROQ"),
    api_key= os.getenv("GROQ_API_KEY"),
    timeout=30,   #abandonne si groq ne répond pas
)

MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")


def repondre(message:str , historique : list[dict])-> str :
    """Envoie le message + l'historique au llm et retourne sa réponse"""

    messages = (
        [{"role": "system", "content": SYSTEM_PROMPT}]

        +historique

        + [{"role":"user" , "content" : message}]
    )


    reponse = client.chat.completions.create(
        model = MODEL , 
        messages = messages,
        temperature = 0.3,
    )

    return reponse.choices[0].message.content