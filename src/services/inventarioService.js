import api from './api'; 

export const obtenerEstadisticas = async () => {
  try {
    const response = await api.get('/inventario/estadisticas');
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

export const obtenerMovimientos = async (page = 0, size = 10, filtros = {}) => {
  try {
    const params = new URLSearchParams({ page, size, ...filtros });
    const response = await api.get(`/inventario/historial?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    throw error;
  }
};

export const obtenerTopProductosPorValor = async () => {
  try {
    const response = await api.get('/inventario/top-productos-por-valor');
    return response.data;
  } catch (error) {
    console.error('Error al obtener top productos por valor:', error);
    throw error;
  }
};

export const actualizarStock = async (productoId, stockUpdateRequest) => {
  try {
    const response = await api.patch(`/inventario/productos/${productoId}/stock`, stockUpdateRequest);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    throw error;
  }
};