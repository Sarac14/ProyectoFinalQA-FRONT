  import { jwtDecode } from 'jwt-decode'  

  import api from './api';

  export async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    console.log("Inicio de sesion");
    return response.data;
  }

  export function guardarToken(token) {
    localStorage.setItem('token', token.jwtToken)
  }


  export function obtenerToken() {
    return localStorage.getItem('token')
  }

  export function obtenerRolDesdeToken() {
    const token = localStorage.getItem('token')
    if (!token) return null
    console.log("token ", token);
    try {
      const decoded = jwtDecode(token) 
      return decoded.rol
    } catch (error) {
      console.error('Token inválido', error)
      return null
    }
  }

  export function obtenerUsuarioDesdeToken() {
    const token = localStorage.getItem('token')
    if (!token) return null
    console.log("token ", token);
    try {
      const decoded = jwtDecode(token) 
      return decoded.nombre
    } catch (error) {
      console.error('Token inválido', error)
      return null
    }
  }

  export function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }