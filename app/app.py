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

@app.route("/api/process", methods=["POST"])
@cross_origin()
def process() -> Response:
    try:
        db_filename = str(request.json.get("filename", ""))
        question = str(request.json.get("question", ""))
        
        if not db_filename or not question:
            raise BadRequest("Both 'filename' and 'question' must be provided in the request.")

        db_wrapper = Database(db_filename)
        full_chain = ChainGen.full_chain(db_wrapper, Prompt.SQL_TO_NL_PROMPT.value, Prompt.NL_TO_SQL_PROMPT.value, model)
        
        result = full_chain.invoke({"question": f"{question}"})

        return jsonify({"response": result.strip()})

    except BadRequest as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        # Log the error for investigation
        app.logger.error(f"An internal server error occurred: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=False)