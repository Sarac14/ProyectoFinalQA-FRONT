import axios from 'axios';
import router from '@/router'; 

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

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("⚠️ Sesión expirada o no autorizada. Redirigiendo al login...");

      localStorage.removeItem('token');

      if (router.currentRoute.value.path !== '/login') {
        router.push('/login');
      }
    }

    return Promise.reject(error);
  }
);

console.log("🌐 API URL en uso:", baseURL);
export default api;
