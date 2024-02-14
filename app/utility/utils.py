from dotenv import load_dotenv
import os
from langchain_core.prompts import ChatPromptTemplate

def get_key()->str:
    """Get Replicate API token

    Returns:
        str: Replicate API token
    """
    load_dotenv()
    return os.getenv("REPLICATE_API_TOKEN")


def adopt_childfile(parent:str,child:str)->str:
    """Merge root path with filename

    Args:
        parent (str): Root path
        child (str): Filename

    Returns:
        str: Path to the given resource
    """
    return os.path.join(parent, child)
    
def format_fwd_template(template:str)->ChatPromptTemplate:
    """Formatting the given template prompt for the 'forwarding' (NL->SQL) LLM chain

    Args:
        template (str): Template prompt in string format

    Returns:
        ChatPromptTemplate: Template prompt wrapped in ChatPromptTemplate object
    """
    return ChatPromptTemplate.from_messages(
    [
        ("system", 
         "Given an input question, convert it to a SQL query. No pre-amble."),
        ("human", template),
    ]
)
    
def format_bwd_template(template:str)->ChatPromptTemplate:
    """Formatting the given template prompt for the 'backward' (SQL result->NL) LLM chain

    Args:
        template (str): Template prompt in string format

    Returns:
        ChatPromptTemplate: Template prompt wrapped in ChatPromptTemplate object
    """
    return ChatPromptTemplate.from_messages(
    [
        ("system",
            "Given an input question and your SQL response, convert it to a natural language answer. No pre-amble.",
        ),
        ("human", template),
    ]
)