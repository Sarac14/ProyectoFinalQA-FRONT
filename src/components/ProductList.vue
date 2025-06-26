<template>
  <div class="list-container">
    <div class="top-bar">
      <h2>Lista de Productos</h2>
      <div class="top-buttons">
        <button v-if="rol !== 'CLIENTE'" class="btn crear" @click="irACrearProducto">Crear Producto</button>
        <button class="btn logout" @click="cerrarSesion">Cerrar Sesión</button>
      </div>
    </div>

    <form @submit.prevent="aplicarFiltros" class="filter-form">
      <input v-model="filtros.nombre" placeholder="Nombre" />
      <input v-model="filtros.categoria" placeholder="Categoría" />
      <input v-model.number="filtros.precioMin" type="number" placeholder="Precio Mínimo" />
      <input v-model.number="filtros.precioMax" type="number" placeholder="Precio Máximo" />
      <button type="submit">Buscar</button>
    </form>

    <table class="product-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id">
          <td>{{ producto.nombre }}</td>
          <td>{{ producto.descripcion }}</td>
          <td>{{ producto.categoria }}</td>
          <td>${{ producto.precio.toFixed(2) }}</td>
          <td>{{ producto.cantidad }}</td>
          <td class="acciones">
            <button
              @click="editarProducto(producto.id)"
              title="Editar"
              :disabled="rol === 'CLIENTE'"
              :class="{ disabled: rol === 'CLIENTE' }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2l-6 6M6 18h.01M6 18l3-3m0 0l9-9m0 0a2.121 2.121 0 113-3 2.121 2.121 0 01-3 3z"/>
              </svg>
            </button>
            <button
              @click="eliminarProducto(producto.id)"
              title="Eliminar"
              :disabled="rol === 'CLIENTE'"
              :class="{ disabled: rol === 'CLIENTE' }"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="icon delete" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3h10z"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout, obtenerRolDesdeToken } from '@/services/authService'
import { eliminarProductoPorId, obtenerProductosFiltrados } from '@/services/productoService'

const productos = ref([])
const filtros = ref({
  nombre: '',
  categoria: '',
  precioMin: null,
  precioMax: null
})
const router = useRouter()
const rol = ref(null)

onMounted(() => {
  rol.value = obtenerRolDesdeToken()
  aplicarFiltros()
})

async function aplicarFiltros() {
  try {
    productos.value = await obtenerProductosFiltrados(filtros.value)
  } catch (error) {
    console.error('Error al filtrar productos:', error)
  }
}


async function eliminarProducto(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    await eliminarProductoPorId(id)
    await aplicarFiltros()
  }
}

function editarProducto(id) {
  router.push(`/editar/${id}`)
}

function irACrearProducto() {
  router.push('/form')
}

function cerrarSesion() {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.list-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.top-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.btn.crear {
  background: #10b981;
  color: white;
}

.btn.crear:hover {
  background: #059669;
}

.btn.logout {
  background: #f87171;
  color: white;
}

.btn.logout:hover {
  background: #ef4444;
}

.filter-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-form input {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.filter-form button {
  padding: 0.6rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.product-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.product-table th {
  text-align: left;
  font-size: 0.9rem;
  color: #6b7280;
  padding: 0.75rem 1rem;
}

.product-table td {
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #374151;
  vertical-align: middle;
}

.acciones {
  display: flex;
  gap: 0.5rem;
}

.icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  transition: transform 0.2s ease;
}

.icon.delete {
  color: #ef4444;
}

button {
  background: transparent;
  border: none;
  padding: 0.3rem;
  cursor: pointer;
}

button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
