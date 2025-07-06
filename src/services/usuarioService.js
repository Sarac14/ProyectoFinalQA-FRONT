import axios from 'axios';
import { obtenerToken } from './authService'

const API_URL = 'http://localhost:8080/api/usuarios'

function getAuthHeaders() {
  const token = obtenerToken()
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export const obtenerUsuarios = async (page = 0, size = 10) => {
  const response = await axios.get(`${API_URL}?page=${page}&size=${size}`, getAuthHeaders());
  return response.data;
};

export const obtenerUsuarioPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const crearUsuario = async (usuario) => {
  const response = await axios.post(API_URL, usuario, getAuthHeaders());
  return response.data;
};

export const actualizarUsuario = async (id, usuario) => {
  const response = await axios.put(`${API_URL}/${id}`, usuario, getAuthHeaders());
  return response.data;
};

export const actualizarEstadoUsuario = async (id, nuevoEstado) => {
  const response = await axios.put(`${API_URL}/${id}/estado/${nuevoEstado}`, null, getAuthHeaders());
  return response.data;
};

export const eliminarUsuario = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
