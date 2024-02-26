import re
from dotenv import load_dotenv
import os
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
import sqlite3
from eralchemy2 import render_er 

def get_replicate_key()->str:
    """Get Replicate API token

    Returns:
        str: Replicate API token
    """
    load_dotenv()
    return os.getenv("REPLICATE_API_TOKEN")

def get_hf_key()->str:
    """Get HuggingFaceHub API token

    Returns:
        str: HuggingFaceHub API token
    """
    load_dotenv()
    return os.getenv("HUGGINGFACEHUB_API_TOKEN")

def adopt_childfile(parent:str,child:str)->str:
    """Merge root path with filename

    Args:
        parent (str): Root path
        child (str): Filename

    Returns:
        str: Path to the given resource
    """
    return os.path.join(parent, child)

def format_dbgen_template(template:str)->ChatPromptTemplate:
    """Formatting the given template prompt for 'database generation' LLM chain

    Args:
        template (str): Template prompt in string format

    Returns:
        ChatPromptTemplate: Template prompt wrapped in ChatPromptTemplate object
    """
    
    return PromptTemplate(template=template, input_variables=["tables","job"])


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
    
def check_file(path_to_file:str)->bool:
    """Wrapper method, checks if file exists

    Args:
        path_to_file (str): path to the file to be checked

    Returns:
        bool: boolean val representing the existence of the given file
    """
    
    return os.path.isfile(path_to_file)


def create_path(path:str)->None:
    """Creates path recursively if it does not exist

    Args:
        path (str): Path to create and check
    """
    os.makedirs(path, exist_ok=True)


def plot_er_diagram(db_path: str, output_path: str):
    """
    Loads an SQLite database and plots an ER diagram, storing it as a PNG image.

    Args:
      db_path: Path to the SQLite database file (.db).
      output_path: Path to store the generated ER diagram image (.png).
    """
    
    render_er(db_path, output_path)