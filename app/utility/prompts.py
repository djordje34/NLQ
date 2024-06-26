from . import *
from .utils import *

class Prompt(Enum):
    
    DB_GEN_PROMPT = format_dbgen_template(
    """
    <start_of_turn>user
    Generate SQL code to create tables for a SQLite database for {job}, which contains at least the next tables:
    {tables}\n
    Return only SQL code.
    <end_of_turn>
    <start_of_turn>model
    """
    )
    
    
    NL_TO_SQL_PROMPT = format_fwd_template(
        """You are a natural language to SQL translator. You respond only using SQL.\n
        Carefully consider the provided table schema below and write a precise and correct SQL query to answer the user's question.\n
        Ensure the generated SQL query is accurate and retrieves as much relevant information as possible.\n
        Pay close attention to the schema details and structure and ensure that the generated SQL query is syntactically correct. 
        Based on the table schema below, 
        write a SQL query that would answer the user's question in SQL syntax.
        Table Schema:\n
        {schema}

        Question: {question}\n
        Pay attention to use only the column names you can see in the tables below. 
        Always scope field names with the table name.
        It is very important that you reply using only SQL code, there is no need for explanations or directions. Pay close attention to the schema and table names.
        
        SQL Query:""")
    
    
    SQL_TO_NL_PROMPT = format_bwd_template(
        """You are translating the provided SQL response into natural language, maintaining clarity, information and coherence.
        Translate the provided SQL response into clear and concise natural language. 
        Craft a response based on the given table schema, question, SQL query, and SQL response, without reiterating the question or SQL output.

        Based on the table schema below, question, sql query, and sql response, write a natural language response.
        Table Schema:\n
        {schema}

        Question: {question}
        SQL Query: {query}
        SQL Response: {response}
        
        Your answer should be in a friendly format and a direct answer to user's query, with all the information necessary and contained within SQL Response. 
        Answer like you're in a normal conversation talking to another human, and translate the SQL response.
        Your response should be based on the SQL Response, do not make up any other responses. 
        """)
    
        