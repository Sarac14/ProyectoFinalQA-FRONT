import axios from 'axios'
import { obtenerToken } from './authService'

const API_URL = 'http://localhost:8080/api/productos'

function getAuthHeaders() {
  const token = obtenerToken()
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export async function obtenerProductoPorId(id) {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders())
  return response.data
}

export async function crearProducto(producto) {
  const response = await axios.post(API_URL, producto, getAuthHeaders())
  return response.data
}

export async function obtenerProductos() {
  const response = await axios.get(API_URL, getAuthHeaders())
  return response.data
}

export async function obtenerProductosPaginados(page = 0, size = 10) {
  const response = await axios.get(`${API_URL}?page=${page}&size=${size}`, getAuthHeaders());
  return response.data; 
}


export async function actualizarProducto(id, data) {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders())
  return response.data
}

export async function eliminarProductoPorId(id) {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders())
}

export async function obtenerProductosFiltrados(filtros) {
  const filters = filtros.value ?? filtros;

const hasFilters =
  (filters.nombre && filters.nombre.trim() !== '') ||
  (filters.categoria && filters.categoria.trim() !== '') ||
  filters.precioMin != null ||
  filters.precioMax != null ||
  (filters.busqueda && filters.busqueda.trim() !== '');

if (!hasFilters) {
  const response = await axios.get(`${API_URL}`, getAuthHeaders());
  return response.data; 
}

  const params = new URLSearchParams();
  if (filters.nombre && filters.nombre.trim() !== '') params.append('nombre', filters.nombre);
  if (filters.categoria && filters.categoria.trim() !== '') params.append('categoria', filters.categoria);
  if (filters.precioMin != null) params.append('precioMin', filters.precioMin);
  if (filters.precioMax != null) params.append('precioMax', filters.precioMax);
  if (filters.busqueda && filters.busqueda.trim() !== '') params.append('busqueda', filters.busqueda); 
  params.append('page', 0);
  params.append('size', 100);

  const response = await axios.get(`${API_URL}/filtro?${params.toString()}`, getAuthHeaders());
  return response.data.content;
}

export async function obtenerCategorias() {
  const response = await axios.get(`${API_URL}/listar-categorias`, getAuthHeaders());
  return response.data
}



