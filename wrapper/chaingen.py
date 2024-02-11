from langchain_core.runnables import RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from wrapper.db import Database
from wrapper.model import Model
from langchain_core.output_parsers import StrOutputParser

class ChainGen:
    
    @classmethod
    def forward_chain(db:Database, prompt:ChatPromptTemplate, model:Model)->any:
        """Generates a NL->SQL converter chain.

        Args:
            db (Database): Database object
            prompt (ChatPromptTemplate): Prompt template object
            model (Model): model wrapper object

        Returns:
            any: NL->SQL converter chain
        """
        return (
        RunnablePassthrough.assign(schema = db.get_schema)
        | prompt
        | model.llm.bind(stop=["\nSQLResult:"])
        | StrOutputParser()
        )
        
    @classmethod
    def full_chain(db:Database, prompt_response:ChatPromptTemplate, model:Model)->any:
        """Generas a NL->SQL->NL converter chain. Converts a natural language prompt to\
            SQL prompt, executes the given prompt, and returns the result in NL.

        Args:
            db (Database): Database object
            prompt (ChatPromptTemplate): Prompt template object
            model (Model): model wrapper object

        Returns:
            any: NL->SQL->NL converter chain
        """
        
        return (
        RunnablePassthrough.assign(query=ChainGen.forward_chain())
        | RunnablePassthrough.assign(
            schema=db.get_schema,
            response=lambda x: db.run(x["query"]),
        )
        | prompt_response
        | model.llm
        )
        