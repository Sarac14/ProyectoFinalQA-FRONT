import api from './api'; 


export const obtenerUsuarios = async (page = 0, size = 10) => {
  const response = await api.get(`/usuarios?page=${page}&size=${size}`);
  return response.data;
};

export const obtenerUsuarioPorId = async (id) => {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
};

export const crearUsuario = async (usuario) => {
  const response = await api.post('/usuarios', usuario);
  return response.data;
};

export const actualizarUsuario = async (id, usuario) => {
  const response = await api.put(`/usuarios/${id}`, usuario);
  return response.data;
};

export const actualizarEstadoUsuario = async (id, nuevoEstado) => {
  const response = await api.put(`/usuarios/${id}/estado/${nuevoEstado}`);
  return response.data;
};

export const eliminarUsuario = async (id) => {
  await api.delete(`/usuarios/${id}`);
};