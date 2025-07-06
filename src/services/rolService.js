import axios from 'axios';
import { obtenerToken } from './authService'

const API_URL = 'http://localhost:8080/api/roles'

function getAuthHeaders() {
  const token = obtenerToken()
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export const obtenerRoles = async () => {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
};