import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; //node root

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
