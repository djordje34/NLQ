from enum import Enum
from utils import *

class Prompt(Enum):
    
    NL_TO_SQL_PROMPT = format_fwd_template(
        """Based on the table schema below, 
        write a SQL query that would answer the user's question:
        {schema}

        Question: {question}
        SQL Query:""")
    
    SQL_TO_NL_PROMPT = format_bwd_template(
        """Based on the table schema below, question, sql query,
        and sql response, 
        write a natural language response:
        {schema}

        Question: {question}
        SQL Query: {query}
        SQL Response: {response}""")
    
        