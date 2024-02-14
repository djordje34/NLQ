import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // Replace with your server URL

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
