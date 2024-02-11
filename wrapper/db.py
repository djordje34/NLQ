from utility.utils import adopt_childfile

class Database:

    def __init__(self, filename):
        self._db = adopt_childfile("data",filename)
        
    def get_schema(self,_):
        return self._db.get_table_info()
    
    def run_query(self, query):
        return self._db.run(query)