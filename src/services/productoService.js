import axios from 'axios'

const API_URL = 'http://localhost:8000/api/productos'

export async function obtenerProductoPorId(id) {
  const response = await axios.get(`${API_URL}/${id}`)
  return response.data
}

export async function crearProducto(producto) {
  const response = await axios.post(API_URL, producto)
  return response.data
}

export async function obtenerProductos() {
  const res = await axios.get(API_URL)
  return res.data
}

export async function actualizarProducto(id, data) {
  const response = await axios.put(`${API_URL}/${id}`, data)
  return response.data
}

export async function eliminarProductoPorId(id) {
  await axios.delete(`${API_URL}/${id}`)
}
