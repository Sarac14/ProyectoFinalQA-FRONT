import axios from 'axios';
import { obtenerToken } from './authService'

const API_URL = 'http://localhost:8080/api/inventario'

function getAuthHeaders() {
  const token = obtenerToken()
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export const obtenerEstadisticas = async () => {
  try {
    const response = await axios.get(`${API_URL}/estadisticas`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};


export const obtenerMovimientos = async (page = 0, size = 10, filtros = {}) => {
  try {
    const params = new URLSearchParams({ page, size, ...filtros })
    const response = await axios.get(`${API_URL}/historial?${params.toString()}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    throw error;
  }
}


export const obtenerTopProductosPorValor = async () => {
  const response = await axios.get(`${API_URL}/top-productos-por-valor`, getAuthHeaders())
  return response.data;
};



