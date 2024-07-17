from . import *

class Database:

    def __init__(self, user_id:str,filename:str):
        """Initialize a Database wrapper object using database filename

        Args:
            userId (str): name of the database folder (db's user's ID)
            filename (str): name of the database file (with extension)
        """
        filepath = adopt_childfile(user_id, filename)
        self._name = filename
        self._path = adopt_childfile("..\data",filepath)
        self._erdpath = adopt_childfile("..\diagrams",filepath)
        
        self._path = f"sqlite:///{self._path}"
        self._erdpath = f"{self._erdpath.rsplit('.',1)[0]}.png"
        
        self._db = SQLDatabase.from_uri(self._path)
        self.plot()
        
    def get_schema(self,_:any)->any:
        """Get database schema from the wrapper object

        Args:
            _ (any): Throwaway variable - used for conveniences in chain construction -\
                returns last value read by the python interpreter

        Returns:
            any: Database schema
        """
        
        return self._db.get_table_info()
    
    def get_path(self)->str:
        """Returns path to database file

        Returns:
            str: path to db file
        """
        
        return self._path
    
    def get_erdpath(self)->str:
        """Returns path to ER diagram plot file

        Returns:
            str: path to ER diagram plot file
        """
        
        return self._erdpath
    
    def run_query(self, query:str):
        """Run a query in database from the wrapper object

        Args:
            query (str): A query to run

        Returns:
            str: Query result
        """
        query = query.split(";")[0]
        
        print(query)
        
        return self._db.run(query)
    
    def plot(self):
        """Creates ER diagram for the given database
        """
        if check_file(self.get_erdpath()):
            print(f"Using existing {self._name} ER diagram")
            return
        
        create_path("\\".join(self.get_erdpath().split('\\')[:-1]))
        print("\\".join(self.get_erdpath().split('\\')[:-1]))
        plot_er_diagram(self._path, self._erdpath)
        
        