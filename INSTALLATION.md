## Retrieve the project

1. **Clone the repository:**

    ```bash
    git clone https://github.com/djordje34/PY-NLQ.git
    cd PY-NLQ
    ```
## Flask Server

1. **Create virtual enviroment and install dependencies:**

    ```bash
    python -m venv env
    python -m pip install -r requirements.txt
    ```
3. **Activate virtual enviroment:**
    On Windows:
    ```bash
    ./env/Scripts/activate
    ```
    On Linux:
    ```bash
    source env/bin/activate
    ```
3. **Start the flask server:**
    On Windows:
    ```bash
    cd app
    set FLASK_APP=app
    flask run
    ```
    On Linux:
    ```bash
    cd app
    export FLASK_APP=app
    flask run
    ```

4. **Testing the Flask Server API by sending a POST request to http://127.0.0.1:5000/api/process with body:**
   ```js
     {
        "filename": "database.db", //database file from the "data/" folder
        "userId": "the id of db's user", //name of the database folder (db's user's ID) 
        "question": "Query" //Query to run
     }
   ```
   Expected output:
   ```js
     {
       "response": "query response"
     }
   ```

## Node.js Server

1. **Install dependencies:**
  ```bash
     cd backend
     npm install
  ```
2. **Start Node.js Server:**
  ```bash
     node index.js
  ```
3. **Access the Node.js Server at [http://localhost:3000](http://localhost:3000)**

## React.js

1. **Install dependencies:**
  ```bash
     cd frontend
     npm install
  ```
2. **Start React.js Development Server:**
  ```bash
     npm run dev
  ```
3. **Access the Node.js Server at [http://localhost:5173](http://localhost:5173)**
