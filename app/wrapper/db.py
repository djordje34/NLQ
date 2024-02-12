from utility.utils import adopt_childfile
from langchain_community.utilities import SQLDatabase

class Database:

    def __init__(self, filename):
        self._path = adopt_childfile("data",filename)
        self._db = SQLDatabase.from_uri(f"sqlite:///{self._path}")
        
    def get_schema(self,_):
        return self._db.get_table_info()
    
    def run_query(self, query):
        return self._db.run(query)