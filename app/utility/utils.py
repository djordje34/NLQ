from dotenv import load_dotenv
import os
from langchain_core.prompts import ChatPromptTemplate

def get_key()->str:
    load_dotenv()
    return os.getenv("REPLICATE_API_TOKEN")


def adopt_childfile(parent:str,child:str)->str:
    return os.path.join(parent, child)
    
def format_fwd_template(template:str)->ChatPromptTemplate:
    return ChatPromptTemplate.from_messages(
    [
        ("system", 
         "Given an input question, convert it to a SQL query. No pre-amble."),
        ("human", template),
    ]
)
    
def format_bwd_template(template:str)->ChatPromptTemplate:
    return ChatPromptTemplate.from_messages(
    [
        ("system",
            "Given an input question and your SQL response, convert it to a natural language answer. No pre-amble.",
        ),
        ("human", template),
    ]
)