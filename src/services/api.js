import axios from 'axios';

const currentHost = window.location.hostname; 
const baseURL = `http://${currentHost}:8080/api`;

const api = axios.create({
  baseURL: baseURL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log("🌐 API URL en uso:", baseURL);
export default api;