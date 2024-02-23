import json
from flask import Flask, Response, jsonify, request
from flask_cors import CORS, cross_origin
from werkzeug.exceptions import BadRequest, InternalServerError
from wrapper.db import Database
from wrapper.model import Model
from wrapper.chaingen import ChainGen
from utility.prompts import Prompt



app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

model = Model()

#this needs to be fixed ASAP
#add to the docs!
@app.route("/api/diagrams", methods=["POST"]) #endpoint da pretvori u db `ERD` grafik
@cross_origin()
def graphify() -> Response:
    """Generates ERD diagram for db provided by filename, of user provided by userId.

    Returns:
        Response: Path to ERD .png
    """
    try:
        db_filename = str(request.json.get("filename", ""))
        user_id = str(request.json.get("userId", ""))
        db_wrapper = Database(user_id,db_filename)
        
        return jsonify({"path": f"{db_wrapper.get_erdpath()}"})
    
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        app.logger.error(f"An internal server error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    

@app.route("/api/process", methods=["POST"])
@cross_origin()
def process() -> Response: #proveri
    """Generates and returns a natural language interpreted SQL query result\
    using natural language prompt provided by the request's body
    
    Example:
        "How many employees are there?" will return something like "There are x employees."

    Raises:
        BadRequest: Client-side bad request

    Returns:
        Response: A natural language interpreted SQL query result
    """
    
    try:
        db_filename = str(request.json.get("filename", ""))
        user_id = str(request.json.get("userId", ""))
        question = str(request.json.get("question", ""))
        
        if not db_filename or not question or not user_id:
            raise BadRequest("Both 'filename' and 'question' must be provided in the request.")

        db_wrapper = Database(user_id,db_filename)
        full_chain = ChainGen.full_chain(db_wrapper, Prompt.SQL_TO_NL_PROMPT.value, Prompt.NL_TO_SQL_PROMPT.value, model)
        
        result = full_chain.invoke({"question": f"{question}"})

        return jsonify({"response": result.strip()})

    except BadRequest as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        app.logger.error(f"An internal server error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=False)