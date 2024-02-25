from langchain_community.llms import Replicate
from utility.utils import get_key

class Model:
    """
    Wraps llama-2-13b-chat for convenience
    """
    
    def __init__(self):
        """
        Constructs a wrapper object for LLM
        """
        
        REPLICATE_API_TOKEN = get_key()
        self.replicate_id = "meta/llama-2-70b-chat:58d078176e02c219e11eb4da5a02a7830a283b14cf8f94537af893ccff5ee781"
        self.llm = Replicate(model=self.replicate_id,
                              model_kwargs={"temperature": 0.01,
                                            "max_length": 1000,
                                            "top_p": 1})
    