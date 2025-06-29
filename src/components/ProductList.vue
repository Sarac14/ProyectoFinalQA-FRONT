<template>
  <div class="list-container">
    <div class="top-bar">
      <h2>Lista de Productos</h2>
      <div class="top-buttons">
        <button v-if="rol !== 'CLIENTE'" class="btn crear" @click="irACrearProducto">Crear Producto</button>
        <button class="btn filter" @click="abrirModalFiltro" title="Filtros">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon-filter" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
          </svg>
          Filtros
        </button>
        <button class="btn logout" @click="cerrarSesion">Cerrar Sesión</button>
      </div>
    </div>

    <div v-if="mostrarModalFiltro" class="modal-overlay" @click="cerrarModalFiltro">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Filtrar Productos</h3>
          <button class="btn-close" @click="cerrarModalFiltro">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon-close" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="aplicarFiltros" class="modal-form">
          <div class="form-group">
            <label for="nombre">Nombre del Producto:</label>
            <input 
              id="nombre"
              v-model="filtros.nombre" 
              type="text"
              placeholder="Buscar por nombre..." 
            />
          </div>

          <div class="form-group">
            <label for="categoria">Categoría:</label>
            <input 
              id="categoria"
              v-model="filtros.categoria" 
              type="text"
              placeholder="Buscar por categoría..." 
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="precioMin">Precio Mínimo:</label>
              <input 
                id="precioMin"
                v-model.number="filtros.precioMin" 
                type="number" 
                step="0.01"
                min="0"
                placeholder="0.00" 
              />
            </div>

            <div class="form-group">
              <label for="precioMax">Precio Máximo:</label>
              <input 
                id="precioMax"
                v-model.number="filtros.precioMax" 
                type="number" 
                step="0.01"
                min="0"
                placeholder="999.99" 
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn secundario" @click="limpiarFiltros">
              Limpiar Filtros
            </button>
            <button type="submit" class="btn primario">
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="hayFiltrosActivos" class="filtros-activos">
      <!--span class="filtro-badge">Filtros aplicados</span-->
      <button class="btn-limpiar-filtros" @click="limpiarFiltros">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Limpiar todos
      </button>
    </div>

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

    <div v-if="productos.length === 0" class="no-productos">
      <p>No se encontraron productos con los filtros aplicados.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
const mostrarModalFiltro = ref(false)
const router = useRouter()
const rol = ref(null)

const hayFiltrosActivos = computed(() => {
  return filtros.value.nombre || 
         filtros.value.categoria || 
         filtros.value.precioMin !== null || 
         filtros.value.precioMax !== null
})

onMounted(() => {
  rol.value = obtenerRolDesdeToken()
  cargarTodosLosProductos()
})

async function aplicarFiltros() {
  try {
    console.log("Filtros enviados:", filtros);
    productos.value = await obtenerProductosFiltrados(filtros.value)
    mostrarModalFiltro.value = false
  } catch (error) {
    console.error('Error al filtrar productos:', error)
  }
}

async function cargarTodosLosProductos() {
  try {
    console.log("Filtros enviados:", filtros);
    productos.value = await obtenerProductosFiltrados({})
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
}

function abrirModalFiltro() {
  mostrarModalFiltro.value = true
}

function cerrarModalFiltro() {
  mostrarModalFiltro.value = false
}

function limpiarFiltros() {
  filtros.value = {
    nombre: '',
    categoria: '',
    precioMin: null,
    precioMax: null
  }
  cargarTodosLosProductos() 
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
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn.crear {
  background: #10b981;
  color: white;
}

.btn.crear:hover {
  background: #059669;
}

.btn.filter {
  background: #3b82f6;
  color: white;
}

.btn.filter:hover {
  background: #2563eb;
}

.btn.logout {
  background: #f87171;
  color: white;
}

.btn.logout:hover {
  background: #ef4444;
}

.icon-filter {
  width: 18px;
  height: 18px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #374151;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.btn-close:hover {
  background-color: #f3f4f6;
}

.icon-close {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn.primario {
  background: #3b82f6;
  color: white;
}

.btn.primario:hover {
  background: #2563eb;
}

.btn.secundario {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn.secundario:hover {
  background: #e5e7eb;
}

.filtros-activos {
  text-align: left;
  padding: 0.75rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
}


.filtro-badge {
  background: #3b82f6;
  color: white;
  padding: 0.4rem 0.8rem; 
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}


.btn-limpiar-filtros {
  background: #f87171;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background-color 0.2s ease;
  width: auto; 
  flex-shrink: 0; 
}

.btn-limpiar-filtros:hover {
  background: #ef4444;
}

.icon-small {
  width: 14px;
  height: 14px;
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

.no-productos {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .top-buttons {
    justify-content: center;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>