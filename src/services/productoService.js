import api from './api';

export async function obtenerProductoPorId(id) {
  const response = await api.get(`/productos/${id}`);
  return response.data;
}

export async function crearProducto(producto) {
  const response = await api.post('/productos', producto);
  return response.data;
}

export async function obtenerProductos() {
  const response = await api.get('/productos');
  return response.data;
}

export async function obtenerProductosPaginados(page = 0, size = 10) {
  const response = await api.get(`/productos?page=${page}&size=${size}`);
  return response.data;
}

export async function actualizarProducto(id, data) {
  const response = await api.put(`/productos/${id}`, data);
  return response.data;
}

export async function eliminarProductoPorId(id) {
  await api.delete(`/productos/${id}`);
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
    const response = await api.get('/productos');
    return response.data;
  }

  const params = new URLSearchParams();
  if (filters.nombre?.trim()) params.append('nombre', filters.nombre);
  if (filters.categoria?.trim()) params.append('categoria', filters.categoria);
  if (filters.precioMin != null) params.append('precioMin', filters.precioMin);
  if (filters.precioMax != null) params.append('precioMax', filters.precioMax);
  if (filters.busqueda?.trim()) params.append('busqueda', filters.busqueda);
  params.append('page', 0);
  params.append('size', 100);

  const response = await api.get(`/productos/filtro?${params.toString()}`);
  return response.data.content;
}

export async function obtenerCategorias() {
  const response = await api.get('/productos/listar-categorias');
  return response.data;
}

export async function obtenerMetricasDashboard() {
  const response = await api.get('/productos/dashboard-metricas');
  return response.data;
}

export async function obtenerProductosConStockBajo() {
  const response = await api.get('/productos/stock-bajo');
  return response.data;
}