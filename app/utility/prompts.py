from enum import Enum
from utility.utils import *

class Prompt(Enum):
    
    NL_TO_SQL_PROMPT = format_fwd_template(
        """You are a natural language to SQL translator. You respond only using SQL.\n
        Carefully consider the provided table schema below and write a precise and correct SQL query to answer the user's question.\n
        Ensure the generated SQL query is accurate and retrieves as much relevant information as possible.\n
        Pay close attention to the schema details and structure and ensure that the generated SQL query is syntactically correct. 
        Based on the table schema below, 
        write a SQL query that would answer the user's question.
        Table Schema:\n
        {schema}

        Question: {question}\n
        SQL Query:""")
    
    
    SQL_TO_NL_PROMPT = format_bwd_template(
        """You are translating the provided SQL response into natural language, maintaining clarity, information and coherence.
        Translate the provided SQL response into clear and concise natural language. 
        Craft a response based on the given table schema, question, SQL query, and SQL response, without reiterating the question or SQL output.

        Based on the table schema below, question, sql query, and sql response, write a natural language response:
        Table Schema:\n
        {schema}

        Question: {question}
        SQL Query: {query}
        SQL Response: {response}""")
    
        