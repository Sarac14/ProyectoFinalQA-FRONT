import api from './api'; // Usar la misma instancia que funciona

// ==========================
// Funciones del servicio
// ==========================

// Listar usuarios con paginación
export const obtenerUsuarios = async (page = 0, size = 10) => {
  const response = await api.get(`/usuarios?page=${page}&size=${size}`);
  return response.data;
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

// Crear usuario
export const crearUsuario = async (usuario) => {
  const response = await api.post('/usuarios', usuario);
  return response.data;
};

// Actualizar usuario
export const actualizarUsuario = async (id, usuario) => {
  const response = await api.put(`/usuarios/${id}`, usuario);
  return response.data;
};

// Cambiar estado de usuario
export const actualizarEstadoUsuario = async (id, nuevoEstado) => {
  const response = await api.put(`/usuarios/${id}/estado/${nuevoEstado}`);
  return response.data;
};

// Eliminar usuario
export const eliminarUsuario = async (id) => {
  await api.delete(`/usuarios/${id}`);
};