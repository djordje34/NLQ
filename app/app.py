import json
from flask import Flask, Response, jsonify, request
from flask_cors import CORS, cross_origin
import sqlite3
import os
from werkzeug.exceptions import BadRequest, InternalServerError
from wrapper.db import Database
from wrapper.model import Model
from wrapper.chaingen import ChainGen
from utility.prompts import Prompt
from utility.utils import adopt_childfile


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

model = Model()

@app.route("/api/database", methods=["POST"])
@cross_origin()
def generate_db() -> Response: #povezi da radi preko Node endpointova, i da dobijeni db dodaje u db
    """Generates SQL code for generation of user-specified database.

    Raises:
        BadRequest: Client-side bad request

    Returns:
        Response: SQL code for database creation. (for now at least)
    """
    try:
        job = str(request.json.get("job",""))
        tables = str(request.json.get("tables",""))
        user_id = str(request.json.get("userId", ""))
        name = str(request.json.get("name", ""))

        if not job or not tables or not user_id:
            raise BadRequest("'job', 'userId', 'name' and 'tables' must be provided in the request.")
        
        generator = ChainGen.db_chain(Prompt.DB_GEN_PROMPT.value, model)
        result = generator.invoke({"job": f"{job}","tables":f"{tables}"})['text']
        result = result[result.find("```sql")+6:-3]
        conn = sqlite3.connect(":memory:")
        cursor = conn.cursor()

        cursor.executescript(result.strip())
        dump = conn.iterdump()
        
        path_to_save = adopt_childfile(user_id, f"{name}.db")
        path_to_save = adopt_childfile("..\\data", path_to_save)
        
        conn_save = sqlite3.connect(path_to_save)

        cursor_save = conn_save.cursor()
        cursor_save.executescript('\n'.join(dump))
        conn_save.commit()
        
        conn.close()
        conn_save.close()
        
        return jsonify({"path": path_to_save})
        
    except BadRequest as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        app.logger.error(f"An internal server error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
        

@app.route("/api/diagrams", methods=["GET"])
@cross_origin()
def graphify() -> Response:
    """Generates ERD diagram for db provided by filename, of user provided by userId.

    Returns:
        Response: Path to ERD .png
    """
    try:
        db_filename = str(request.args.get("filename", ""))
        user_id = str(request.args.get("userId", ""))
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