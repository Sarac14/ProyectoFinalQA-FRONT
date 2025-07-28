<template>
  <div class="list-container">
    <div class="top-bar">
      <h2>Lista de Productos</h2>
      <div class="top-buttons">
        <button v-if="rol !== 'CLIENTE'" class="btn btn-create" @click="irACrearProducto">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Crear
        </button>
        <button class="btn btn-filter" @click="abrirModalFiltro">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
          </svg>
          Filtros
        </button>
        <button class="btn btn-dashboard" @click="irADashboard">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
          </svg>
          Dashboard
        </button>
        <template v-if="rol === 'ADMIN'">
          <div class="dropdown">
            <button class="btn btn-admin" @click="toggleAdminMenu">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </button>
            <div v-if="mostrarMenuAdmin" class="dropdown-menu">
              <button class="dropdown-item" @click="irAHistorial">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Historial
              </button>
              <button class="dropdown-item" @click="irAUsuarios">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Usuarios
              </button>
            </div>
          </div>
        </template>
        <button class="btn btn-logout" @click="cerrarSesion">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Salir
        </button>
      </div>
    </div>

    <div class="dashboard-metrics">
      <div class="card-metric">
        <h3>Total de productos</h3>
        <p>{{ metricas.totalProductos }}</p>
      </div>
      <div 
        class="card-metric warning tooltip-wrapper" 
        @mouseenter="mostrandoTooltipStock = true" 
        @mouseleave="mostrandoTooltipStock = false"
      >
        <h3>Stock bajo</h3>
        <p>{{ metricas.stockBajo }}</p>

        <div v-if="mostrandoTooltipStock" class="tooltip-stock-list">
          <h4>Productos con stock bajo:</h4>
          <ul>
            <li v-for="prod in productosStockBajo" :key="prod.id">
              {{ prod.nombre }} ({{ prod.cantidad }})
            </li>
          </ul>
        </div>
      </div>

    </div>

    <div class="dashboard-activity">
      <div class="activity-card">
        <h4>Top productos por actividad</h4>
        <canvas id="actividadChart"></canvas>
      </div>
    </div>

    <div class="search-container">
      <div class="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="terminoBusqueda"
          @input="buscarProductos"
          type="text"
          placeholder="Buscar productos por nombre, descripción o categoría..."
          class="search-input"
        />
      </div>
    </div>

    <div v-if="mostrarModalFiltro" class="modal-overlay" @click="cerrarModalFiltro">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Filtrar Productos</h3>
          <button class="btn-close" @click="cerrarModalFiltro">×</button>
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
            <select 
              id="categoria"
              v-model="filtros.categoria"
            >
              <option value="">Todas las categorías</option>
              <option v-for="cat in categoriasDisponibles" :key="cat" :value="cat">
                {{ cat.charAt(0) + cat.slice(1).toLowerCase() }}
              </option>
            </select>
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
            <button type="button" class="btn btn-secondary" @click="limpiarFiltros">
              Limpiar Filtros
            </button>
            <button type="submit" class="btn btn-primary">
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="hayFiltrosActivos" class="filtros-activos">
      <button class="btn-limpiar-filtros" @click="limpiarFiltros">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
        Limpiar filtros
      </button>
    </div>

    <div class="table-container">
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
            <td class="font-medium">{{ producto.nombre }}</td>
            <td class="text-gray">{{ producto.descripcion }}</td>
            <td>
              <span class="category-badge">{{ producto.categoria }}</span>
            </td>
            <td class="font-medium">${{ producto.precio.toFixed(2) }}</td>
            <td>
              <span :class="['stock-badge', producto.cantidad < 10 ? 'low-stock' : 'normal-stock']">
                {{ producto.cantidad }}
              </span>
            </td>
            <td class="acciones">
              <button
                @click="editarProducto(producto.id)"
                title="Editar"
                :disabled="rol === 'CLIENTE'"
                class="action-btn edit-btn"
                :class="{ disabled: rol === 'CLIENTE' }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="icon-action" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2l-6 6M6 18h.01M6 18l3-3m0 0l9-9m0 0a2.121 2.121 0 113-3 2.121 2.121 0 01-3 3z"/>
                </svg>
              </button>
              <button
                @click="eliminarProducto(producto.id)"
                title="Eliminar"
                :disabled="rol === 'CLIENTE'"
                class="action-btn delete-btn"
                :class="{ disabled: rol === 'CLIENTE' }"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="icon-action" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3h10z"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <br>
    <div class="pagination-container">
      <div class="pagination-info">
        Mostrando {{ (paginaActual * tamanoPagina) + 1 }} - {{ Math.min((paginaActual + 1) * tamanoPagina, totalProductos) }} de {{ totalProductos }} productos
      </div>

      <div class="pagination-controls">
        <button @click="irPrimeraPagina" :disabled="paginaActual === 0" class="btn-pagination">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
          </svg>
        </button>

        <button @click="paginaAnterior" :disabled="paginaActual === 0" class="btn-pagination">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Anterior
        </button>

        <div class="page-numbers">
          <button 
            v-for="num in paginasVisibles"
            :key="num"
            @click="irPagina(num - 1)"
            :class="['page-number', { active: num - 1 === paginaActual }]"
          >
            {{ num }}
          </button>
        </div>

        <button @click="siguientePagina" :disabled="paginaActual >= totalPaginas - 1" class="btn-pagination">
          Siguiente
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        <button @click="irUltimaPagina" :disabled="paginaActual >= totalPaginas - 1" class="btn-pagination">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="productos.length === 0" class="no-productos">
      <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p>No se encontraron productos</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { logout, obtenerRolDesdeToken } from '@/services/authService'
import { eliminarProductoPorId, obtenerProductosFiltrados, obtenerCategorias, obtenerProductosPaginados, obtenerMetricasDashboard, obtenerProductosConStockBajo } from '@/services/productoService'
import Chart from 'chart.js/auto'

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
const categoriasDisponibles = ref([])
const mostrarMenuAdmin = ref(false)
const terminoBusqueda = ref('')
const timeoutBusqueda = ref(null)
const paginaActual = ref(0)
const totalPaginas = ref(0)
const tamanoPagina = ref(10)
const productosStockBajo = ref([])
const mostrandoTooltipStock = ref(false)
const totalProductos = ref(0)
const paginasVisibles = ref([])

const metricas = ref({
  totalProductos: 0,
  stockBajo: 0,
  topActividad: []
})

async function cargarMetricas() {
  try {
    const data = await obtenerMetricasDashboard()
    metricas.value = data
    renderActividadChart()
  } catch (error) {
    console.error('Error al cargar métricas:', error)
  }
}

async function cargarProductosConStockBajo() {
  try {
    productosStockBajo.value = await obtenerProductosConStockBajo()
  } catch (error) {
    console.error('Error al cargar productos con stock bajo:', error)
  }
}

function renderActividadChart() {
  const labels = metricas.value.topActividad.map(p => p.nombre)
  const data = metricas.value.topActividad.map(p => p.cantidad)

  new Chart(document.getElementById('actividadChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Movimientos',
        data,
        backgroundColor: '#3B82F6'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  })
}

const hayFiltrosActivos = computed(() => {
  return filtros.value.nombre || 
         filtros.value.categoria || 
         filtros.value.precioMin !== null || 
         filtros.value.precioMax !== null ||
         terminoBusqueda.value
})

onMounted(async () => {
  rol.value = obtenerRolDesdeToken();
  cargarMetricas();
  await cargarProductosConStockBajo();
  await cargarProductosPaginados();
  try {
    categoriasDisponibles.value = await obtenerCategorias();
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
});

async function aplicarFiltros() {
  try {
    const filtrosBusqueda = {
      ...filtros.value,
      busqueda: terminoBusqueda.value
    }
    const response = await obtenerProductosFiltrados(filtrosBusqueda)
    productos.value = response.content || response
    mostrarModalFiltro.value = false
  } catch (error) {
    console.error('Error al filtrar productos:', error)
  }
}

async function cargarProductosPaginados() {
  try {
    const response = await obtenerProductosPaginados(paginaActual.value, tamanoPagina.value);
    productos.value = response.content;
    totalPaginas.value = response.totalPages;
    totalProductos.value = response.totalElements;
    actualizarPaginasVisibles();
  } catch (error) {
    console.error('Error al cargar productos paginados:', error);
  }
}


function siguientePagina() {
  if (paginaActual.value < totalPaginas.value - 1) {
    paginaActual.value++;
    cargarProductosPaginados();
  }
}

function paginaAnterior() {
  if (paginaActual.value > 0) {
    paginaActual.value--;
    cargarProductosPaginados();
  }
}

function buscarProductos() {
  if (timeoutBusqueda.value) {
    clearTimeout(timeoutBusqueda.value)
  }
  
  timeoutBusqueda.value = setTimeout(async () => {
    try {
      const filtrosBusqueda = {
        ...filtros.value,
        busqueda: terminoBusqueda.value
      }
      const response = await obtenerProductosFiltrados(filtrosBusqueda)
      productos.value = response.content || response
    } catch (error) {
      console.error('Error al buscar productos:', error)
    }
  }, 300)
}

async function cargarTodosLosProductos() {
  try {
    const response = await obtenerProductosFiltrados({})
    productos.value = response.content || response
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
  terminoBusqueda.value = ''
  if (timeoutBusqueda.value) {
    clearTimeout(timeoutBusqueda.value)
  }
  cargarTodosLosProductos() 
}

async function eliminarProducto(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    await eliminarProductoPorId(id)
    const filtrosBusqueda = {
      ...filtros.value,
      busqueda: terminoBusqueda.value
    }
    const response = await obtenerProductosFiltrados(filtrosBusqueda)
    productos.value = response.content || response
  }
}

function editarProducto(id) {
  router.push(`/editar/${id}`)
}

function irACrearProducto() {
  router.push('/form')
}

function irAHistorial() {
  router.push('/historial')
  mostrarMenuAdmin.value = false
}

function irADashboard() {
  router.push('/dashboard')
  mostrarMenuAdmin.value = false
}

function toggleAdminMenu() {
  mostrarMenuAdmin.value = !mostrarMenuAdmin.value
}

function irAUsuarios() {
  router.push('/admin/usuarios')
  mostrarMenuAdmin.value = false
}

function cerrarSesion() {
  logout()
  router.push('/login')
}

function irPrimeraPagina() {
  paginaActual.value = 0
  cargarProductosPaginados()
}

function irUltimaPagina() {
  paginaActual.value = totalPaginas.value - 1
  cargarProductosPaginados()
}

function irPagina(num) {
  paginaActual.value = num
  cargarProductosPaginados()
}

function actualizarPaginasVisibles() {
  const total = totalPaginas.value
  const actual = paginaActual.value
  const delta = 2 
  let inicio = Math.max(1, actual + 1 - delta)
  let fin = Math.min(total, actual + 1 + delta)

  paginasVisibles.value = Array.from({ length: fin - inicio + 1 }, (_, i) => i + inicio)
}

</script>

<style scoped>
.list-container {
  width: 90vw;
  min-height: 90vh;
  margin: 1rem auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;

}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.top-bar h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.875rem;
  font-weight: 600;
}

.top-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.btn-create {
  background: #10b981;
  color: white;
}

.btn-create:hover {
  background: #059669;
  transform: translateY(-1px);
}

.btn-filter {
  background: #3b82f6;
  color: white;
}

.btn-filter:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-dashboard {
  background: #833bf6;
  color: white;
}

.btn-dashboard:hover {
  background: #702cdf;
  transform: translateY(-1px);
}

.btn-admin {
  background: #f59e0b;
  color: white;
}

.btn-admin:hover {
  background: #d97706;
  transform: translateY(-1px);
}

.btn-logout {
  background: #ef4444;
  color: white;
}

.btn-logout:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.icon {
  width: 16px;
  height: 16px;
}

.icon-small {
  width: 14px;
  height: 14px;
}

.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 8px 8px;
}

.filtros-activos {
  margin-bottom: 1.5rem;
}

.btn-limpiar-filtros {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-limpiar-filtros:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.875rem;
}

.product-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.875rem;
}

.product-table tr:hover {
  background: #f8fafc;
}

.font-medium {
  font-weight: 500;
  color: #1e293b;
}

.text-gray {
  color: #64748b;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.stock-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.normal-stock {
  background: #dcfce7;
  color: #166534;
}

.low-stock {
  background: #fef2f2;
  color: #991b1b;
}

.acciones {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* .action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
} */

.edit-btn {
  background: #e0f2fe;
  color: #0369a1;
}

.edit-btn:hover:not(.disabled) {
  background: #bae6fd;
  transform: scale(1.05);
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover:not(.disabled) {
  background: #fecaca;
  transform: scale(1.05);
}

.action-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon-action {
  width: 16px;
  height: 16px;
}

.no-productos {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  color: #cbd5e1;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.875rem;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #6b7280;
  pointer-events: none;
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.clear-search:hover {
  background: #f3f4f6;
  color: #374151;
}

.clear-icon {
  width: 16px;
  height: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  font-size: 1.25rem;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #374151;
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
  font-size: 0.875rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group select {
  background-color: white;
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  gap: 12px;
  font-family: 'Segoe UI', sans-serif;
}

.pagination-controls button {
  padding: 10px 10px; 
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem; 
  transition: background 0.3s, transform 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-controls button:hover:not(:disabled) {
  background: linear-gradient(135deg, #4f46e5, #4338ca);
  transform: translateY(-1px);
}

.pagination-controls button:disabled {
  background: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  box-shadow: none;
}

.pagination-controls span {
  font-weight: 500;
  font-size: 0.9rem; 
  color: #374151;
}

.dashboard-metrics {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.card-metric {
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  flex: 1 1 220px;
  text-align: center;
}

.card-metric h3 {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 8px;
}

.card-metric p {
  font-size: 2rem;
  font-weight: bold;
  color: #1e40af;
}

.card-metric.warning {
  background: #fff7ed;
  color: #92400e;
}

.dashboard-activity {
  margin-bottom: 40px;
}

.activity-card {
  background: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.activity-card h4 {
  font-size: 1rem;
  margin-bottom: 15px;
  color: #374151;
}

@media (max-width: 768px) {
  .list-container {
    margin: 0.5rem;
    padding: 1rem;
  }

  .top-bar {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .top-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .search-input {
    padding: 0.75rem 1rem 0.75rem 2.25rem;
    font-size: 0.8rem;
  }

  .search-icon {
    left: 0.5rem;
    width: 16px;
    height: 16px;
  }

  .clear-search {
    right: 0.5rem;
  }
}

.tooltip-wrapper {
  position: relative;
}

.tooltip-stock-list {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #1e293b;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  margin-top: 10px;
  width: max-content;
  max-width: 300px;
  font-size: 0.875rem;
}

.tooltip-stock-list h4 {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.tooltip-stock-list ul {
  padding-left: 1rem;
  margin: 0;
}

.tooltip-stock-list li {
  list-style-type: disc;
  margin-bottom: 4px;
}

.pagination-container {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pagination:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-pagination svg {
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
  margin: 0 1rem;
}

.page-number {
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #374151;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  border-color: #667eea;
  color: #667eea;
}

.page-number.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: white;
}
</style>