from . import *
from .db import Database
from .model import Model

class ChainGen:
    
    @classmethod
    def db_chain(cls, db_prompt:ChatPromptTemplate, model:Model)->any:
        """Returns a DB generation chain.

        Args:
            sql_prompt (ChatPromptTemplate): Prompt template object
            model (Model): model wrapper object

        Returns:
            any: DB SQL generation chain
        """

        return LLMChain(prompt=db_prompt, llm = model.db_generator.bind(stop=["\nSQLResult:"]))
    
    
    @classmethod
    def forward_chain(cls,db_wrapper:Database, sql_prompt:ChatPromptTemplate, model:Model)->any:
        """Generates a NL->SQL converter chain.

        Args:
            db (Database): Database object
            sql_prompt (ChatPromptTemplate): Prompt template object
            model (Model): model wrapper object

        Returns:
            any: NL->SQL converter chain
        """
        return (
        RunnablePassthrough.assign(schema = db_wrapper.get_schema)
        | sql_prompt
        | model.llm.bind(stop=["\nSQLResult:"])
        | StrOutputParser()
        )
        
    @classmethod
    def full_chain(cls,db_wrapper:Database, prompt:ChatPromptTemplate, sql_prompt:ChatPromptTemplate, model:Model)->any:
        """Generates a NL->SQL->NL converter chain. Converts a natural language prompt to\
            SQL prompt, executes the given prompt, and returns the result in NL.

        Args:
            db (Database): Database object
            prompt (ChatPromptTemplate): Prompt template object
            sql_prompt (ChatPromptTemplate): NL->SQL prompt conversion
            model (Model): model wrapper object

        Returns:
            any: NL->SQL->NL converter chain
        """
        
        return (
        RunnablePassthrough.assign(query=ChainGen.forward_chain(db_wrapper, sql_prompt, model))
        | RunnablePassthrough.assign(
            schema=db_wrapper.get_schema,
            response=lambda x: db_wrapper.run_query(x["query"]),
        )
        | prompt
        | model.llm
        )
        