import axios from 'axios'
import { jwtDecode } from 'jwt-decode'  

const API_URL = 'http://localhost:8080/api/auth'

export async function login(email, password) {
  const response = await axios.post(`${API_URL}/login`, { email, password })
  return response.data
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

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
}