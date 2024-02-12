from langchain_community.llms import Replicate
from utility.utils import get_key

class Model:
    """Wraps llama-2-13b-chat for convenience
    """
    
    def __init__(self):
        REPLICATE_API_TOKEN = get_key()
        self.replicate_id = "meta/llama-2-13b-chat:f4e2de70d66816a838a89eeeb621910adffb0dd0baba3976c96980970978018d"
        self.llm = Replicate(model=self.replicate_id,
                              model_kwargs={"temperature": 0.01,
                                            "max_length": 1000,
                                            "top_p": 1})
    