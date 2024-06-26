from . import *

class Model:
    """
    Wraps LLM models for convenience
    """
    
    def __init__(self):
        """
        Constructs a wrapper object which contains designated LLMs for querying and generation.
        
        LLAMA-2-70b-Chat : Used for creating NL->SQL->NL chain (Replicate)
        
        Gemma-7b-Instruct : Used for Database generation (HuggingFace)
        """
        HUGGINGFACEHUB_API_TOKEN = get_replicate_key()
        REPLICATE_API_TOKEN = get_hf_key()
        self.replicate_id = "meta/llama-2-70b-chat:58d078176e02c219e11eb4da5a02a7830a283b14cf8f94537af893ccff5ee781"
        self.gemma_id = "google/gemma-7b-it"
        self.llm = Ollama(model="llama3")
        self.db_generator = Ollama(model="llama3")
        """
        self.llm = Replicate(model=self.replicate_id,
                              model_kwargs={"temperature": 0.01,
                                            "max_length": 1000,
                                            "top_p": 1})
        """
        """
        self.db_generator = HuggingFaceHub(repo_id=self.gemma_id,
                                           model_kwargs={"temperature":0.5,
                                                         "max_new_tokens": 2000})
        """