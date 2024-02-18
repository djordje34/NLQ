# API Documentation

This document provides details on the API endpoints, their usage, and expected responses for the PY-NLQ project.

## Authentication

- For authentication, all Node.js API's require a valid JSON Web Token (JWT) to be included in the `Authorization` header.

## Endpoints

### 1. Process NL Query

- **Endpoint:** `http://127.0.0.1:5000/api/process`
- **Method:** `POST`
- **Description:** Process a Natural Language Query and return the corresponding SQL query.
- **Request Body:**
```js
    {
        "filename": "database.db", // Database file from the "data/" folder
        "question": "Query" // Query to run
    }
```
### 2. Databases Endpoints
##### 1. Upload Database
- **Endpoint:** `http://localhost:3000/databases`
- **Method:** `POST`
- **Description:** Upload a database file.
- **Request:**
  - Headers:
    - Authorization: YOUR_JWT_TOKEN
  - Body:
    - `databaseFile`: Database file to be uploaded (multipart/form-data)
- **Response:**
  - Status: 201 Created
  - Body:
    ```js
    {
      "id": "ObjectId",
      "userId": "ObjectId",
      "originalname": "filename",
      "createdAt": "Date"
    }
    ```
- **Error Responses:**
  - Status: 400 Bad Request
  - Body:
    ```js
    { "error": "userId and originalname are required" }
    ```
  - Status: 500 Internal Server Error
##### 2. Get User Databases
- **Endpoint:** `http://localhost:3000/databases`
- **Method:** `GET`
- **Description:** Get databases uploaded by the authenticated user.
- **Request:**
  - Headers:
    - Authorization: YOUR_JWT_TOKEN
- **Response:**
  - Status: 200 OK
  - Body:
    ```js
    [
      {
        "id": "ObjectId",
        "userId": "ObjectId",
        "originalname": "filename",
        "createdAt": "Date"
      },
      // Additional databases...
    ]
    ```
- **Error Responses:**
  - Status: 500 Internal Server Error
### 3. Queries Endpoints
##### 1. Create Query
- **Endpoint:** `http://localhost:3000/queries`
- **Method:** `POST`
- **Description:** Create a new query.
- **Request:**
  - Headers:
    - Authorization: YOUR_JWT_TOKEN
  - Body:
    ```js
    {
      "databaseId": "ObjectId",
      "query": "SQL Query",
      "response": "Query Response"
    }
    ```
- **Response:**
  - Status: 201 Created
  - Body:
    ```js
    {
      "id": "ObjectId",
      "userId": "ObjectId",
      "databaseId": "ObjectId",
      "query": "SQL Query",
      "response": "Query Response",
      "createdAt": "Date"
    }
    ```
- **Error Responses:**
  - Status: 400 Bad Request
  - Body:
    ```js
    { "error": "userId, databaseId, query, and response are required" }
    ```
  - Status: 500 Internal Server Error
##### 2. Get User Queries
- **Endpoint:** `http://localhost:3000/queries`
- **Method:** `GET`
- **Description:** Get queries created by the authenticated user.
- **Request:**
  - Headers:
    - Authorization: YOUR_JWT_TOKEN
- **Response:**
  - Status: 200 OK
  - Body:
    ```js
    [
      {
        "id": "ObjectId",
        "userId": "ObjectId",
        "databaseId": "ObjectId",
        "query": "SQL Query",
        "response": "Query Response",
        "createdAt": "Date"
      },
      // Additional queries...
    ]
    ```
- **Error Responses:**
  - Status: 500 Internal Server Error

### 4. Users Endpoints
##### 1. User Registration
- **Endpoint:** `http://localhost:3000/users`
- **Method:** `POST`
- **Description:** Register a new user.
- **Request:**
  - Body:
    ```js
    {
      "username": "Username",
      "password": "Password"
    }
    ```
- **Response:**
  - Status: 201 Created
  - Body:
    ```js
    { "message": "User registered successfully" }
    ```
- **Error Responses:**
  - Status: 400 Bad Request
  - Body:
    ```js
    { "error": "Username and password are required" }
    ```
  - Status: 500 Internal Server Error
##### 2. User Login
- **Endpoint:** `http://localhost:3000/users/login`
- **Method:** `POST`
- **Description:** Log in a user.
- **Request:**
  - Body:
    ```js
    {
      "username": "Username",
      "password": "Password"
    }
    ```
- **Response:**
  - Status: 200 OK
  - Body:
    ```js
    { "token": "JWT_TOKEN" }
    ```
- **Error Responses:**
  - Status: 401 Unauthorized
  - Body:
    ```js
    { "error": "Invalid password" }
    ```
  - Status: 404 Not Found
  - Body:
    ```js
    { "error": "User not found" }
    ```
  - Status: 500 Internal Server Error
##### 3. Get All Users
- **Endpoint:** `http://localhost:3000/users`
- **Method:** `GET`
- **Description:** Get a list of all users. (Requires authentication)
- **Request:**
  - Headers:
    - Authorization: YOUR_JWT_TOKEN
- **Response:**
  - Status: 200 OK
  - Body:
    ```js
    [
      {
        "_id": "ObjectId",
        "username": "Username",
        "password": "HashedPassword"
      },
      // Additional users...
    ]
    ```
- **Error Responses:**
  - Status: 500 Internal Server Error
##### 4. Get User by ID
- **Endpoint:** `http://localhost:3000/users/:userId`
- **Method:** `GET`
- **Description:** Get user details by ID. (Requires authentication)
- **Request:**
  - Headers:
    - Authorization: YOUR_JWT_TOKEN
- **Response:**
  - Status: 200 OK
  - Body:
    ```js
    {
      "_id": "ObjectId",
      "username": "Username",
      "password": "HashedPassword"
    }
    ```
- **Error Responses:**
  - Status: 404 Not Found
  - Body:
    ```js
    { "error": "User not found" }
    ```
  - Status: 500 Internal Server Error
##### 5. Update User
- **Endpoint:** `http://localhost:3000/users/:userId`
- **Method:** `PUT`
- **Description:** Update user details by ID. (Requires authentication)
- **Request:**
  - Headers:
    - Authorization: YOUR_JWT_TOKEN
  - Body:
    ```js
    {
      "username": "NewUsername",
      "password": "NewPassword"
    }
    ```
- **Response:**
  - Status: 200 OK
  - Body:
    ```js
    { "message": "User updated successfully" }
    ```
- **Error Responses:**
  - Status: 400 Bad Request
  - Body:
    ```js
    { "error": "Username is required" }
    ```
  - Status: 403 Forbidden
  - Body:
    ```js
    { "error": "You are not authorized to update this user" }
    ```
  - Status: 404 Not Found
  - Body:
    ```js
    { "error": "User not found" }
    ```
  - Status: 500 Internal Server Error
### 5. to be added i hope
### 6. also... :(