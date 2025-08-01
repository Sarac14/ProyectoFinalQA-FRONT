import api from './api';

export const obtenerRoles = async () => {
  try {
    const response = await api.get('/roles');
    return response.data;
  } catch (error) {
    console.error('Error al obtener roles:', error);
    throw error;
  }
};