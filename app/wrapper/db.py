from utility.utils import adopt_childfile
from langchain_community.utilities import SQLDatabase

class Database:

    def __init__(self, filename:str):
        """Initialize a Database wrapper object using database filename

        Args:
            filename (str): name of the database file (with extension)
        """
        
        self._path = adopt_childfile("data",filename)
        self._db = SQLDatabase.from_uri(f"sqlite:///{self._path}")
        
    def get_schema(self,_:any):
        """Get database schema from the wrapper object

        Args:
            _ (any): Throwaway variable - used for conveniences in chain construction -\
                returns last value read by the python interpreter

        Returns:
            str: Database schema
        """
        
        return self._db.get_table_info()
    
    def run_query(self, query:str):
        """Run a query in database from the wrapper object

        Args:
            query (str): A query to run

        Returns:
            str: Query result
        """
        
        return self._db.run(query)