<template>
  <div class="historial-container">
    <div class="header-section">
      <div class="title-section">
        <h1 class="page-title">
          Historial de Movimientos
        </h1>
        <p class="subtitle">Seguimiento completo de inventario</p>
      </div>
      
      <div class="filters-section">
        <div class="filter-group">
          <label>Tipo:</label>
          <select v-model="filtroTipo" class="filter-select">
            <option value="">Todos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SALIDA">Salida</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Fecha:</label>
          <input type="date" v-model="filtroFecha" class="filter-input">
        </div>
        
      <button @click="limpiarFiltros" class="btn-icon" title="Limpiar filtros">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon entrada">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.entradas }}</div>
          <div class="stat-label">Entradas</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon salida">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M17 7L7 17M7 17H17M7 17V7"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.salidas }}</div>
          <div class="stat-label">Salidas</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon total">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ historial.length }}</div>
          <div class="stat-label">Total Movimientos</div>
        </div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th>
                <div class="th-content">
                  Producto
                </div>
              </th>
              <th>
                <div class="th-content">
                  Tipo
                </div>
              </th>
              <th>
                <div class="th-content">
                  <svg class="th-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                  </svg>
                  Cantidad
                </div>
              </th>
              <th>Stock Anterior</th>
              <th>Stock Nuevo</th>
              <th>
                <div class="th-content">
                  Responsable
                </div>
              </th>
              <th>
                <div class="th-content">
                  Fecha
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mov in historial" :key="mov.id" class="table-row">
              <td class="product-cell">
                <div class="product-info">
                  <div class="product-name">{{ mov.producto.nombre }}</div>
                </div>
              </td>
              <td>
                <span :class="['badge', `badge-${mov.tipoMovimiento.toLowerCase()}`]">
                  <svg v-if="mov.tipoMovimiento === 'ENTRADA'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 17L17 7M17 7H7M17 7V17"/>
                  </svg>
                  <svg v-else-if="mov.tipoMovimiento === 'SALIDA'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17 7L7 17M7 17H17M7 17V7"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 15l2 2 4-4"/>
                  </svg>
                  {{ mov.tipoMovimiento }}
                </span>
              </td>
              <td class="quantity-cell">
                <span :class="['quantity', mov.tipoMovimiento === 'ENTRADA' ? 'positive' : mov.tipoMovimiento === 'SALIDA' ? 'negative' : 'neutral']">
                  {{ mov.tipoMovimiento === 'ENTRADA' ? '+' : mov.tipoMovimiento === 'SALIDA' ? '-' : '' }}{{ mov.cantidad }}
                </span>
              </td>
              <td class="stock-cell">{{ mov.cantidadAnterior }}</td>
              <td class="stock-cell">
                <span class="stock-new">{{ mov.cantidadNueva }}</span>
              </td>
              <td class="user-cell">
                <div class="user-info">
                  <div class="user-avatar">{{ mov.usuarioResponsable.charAt(0).toUpperCase() }}</div>
                  <span>{{ mov.usuarioResponsable }}</span>
                </div>
              </td>
              <td class="date-cell">
                <div class="date-info">
                  <div class="date">{{ formatearFecha(mov.fechaMovimiento) }}</div>
                  <div class="time">{{ formatearHora(mov.fechaMovimiento) }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="historial.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3>No hay movimientos registrados</h3>
        <p>Los movimientos de inventario aparecerán aquí</p>
      </div>
    </div>

    <div class="pagination-container">
      <div class="pagination-info">
        Mostrando {{ (pagina * tamanoPagina) + 1 }} - {{ Math.min((pagina + 1) * tamanoPagina, totalElementos) }} de {{ totalElementos }} movimientos
      </div>
      
      <div class="pagination-controls">
        <button @click="irPrimera" :disabled="pagina === 0" class="btn-pagination">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
          </svg>
        </button>
        
        <button @click="paginaAnterior" :disabled="pagina === 0" class="btn-pagination">
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
            :class="['page-number', { active: num - 1 === pagina }]"
          >
            {{ num }}
          </button>
        </div>
        
        <button @click="siguientePagina" :disabled="pagina >= totalPaginas - 1" class="btn-pagination">
          Siguiente
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
        
        <button @click="irUltima" :disabled="pagina >= totalPaginas - 1" class="btn-pagination">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { obtenerMovimientos } from '@/services/inventarioService'
import { watch } from 'vue'

const historial = ref([])
const pagina = ref(0)
const tamanoPagina = ref(10)
const totalPaginas = ref(0)
const totalElementos = ref(0)
const filtroTipo = ref('')
const filtroFecha = ref('')

const stats = computed(() => {
  return {
    entradas: historial.value.filter(mov => mov.tipoMovimiento === 'ENTRADA').length,
    salidas: historial.value.filter(mov => mov.tipoMovimiento === 'SALIDA').length,
  }
})

const paginasVisibles = computed(() => {
  const inicio = Math.max(1, pagina.value - 1)
  const fin = Math.min(totalPaginas.value, inicio + 4)
  const paginas = []
  for (let i = inicio; i <= fin; i++) {
    paginas.push(i)
  }
  return paginas
})

watch([filtroTipo, filtroFecha], () => {
  pagina.value = 0 
  cargarHistorial()
})

async function cargarHistorial() {
  try {
    const response = await obtenerMovimientos(pagina.value, tamanoPagina.value, {
      tipo: filtroTipo.value,
      fecha: filtroFecha.value
    })
    historial.value = response.content
    totalPaginas.value = response.totalPages
    totalElementos.value = response.totalElements
  } catch (error) {
    console.error('Error al cargar historial de inventario:', error)
  }
}

function siguientePagina() {
  if (pagina.value < totalPaginas.value - 1) {
    pagina.value++
    cargarHistorial()
  }
}

function paginaAnterior() {
  if (pagina.value > 0) {
    pagina.value--
    cargarHistorial()
  }
}

function irPrimera() {
  pagina.value = 0
  cargarHistorial()
}

function irUltima() {
  pagina.value = totalPaginas.value - 1
  cargarHistorial()
}

function irPagina(nuevaPagina) {
  pagina.value = nuevaPagina
  cargarHistorial()
}

function limpiarFiltros() {
  filtroTipo.value = ''
  filtroFecha.value = ''
  pagina.value = 0
  cargarHistorial()
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function formatearHora(fecha) {
  return new Date(fecha).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  cargarHistorial()
})
</script>

<style scoped>
.historial-container {
  min-height: 100vh;
  width: 90vw;
  padding: 20px;
  background-color: #f8f9fe;
  font-family: 'Segoe UI', sans-serif;
  overflow-x: hidden;
}

.header-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.title-section {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: 700;
}

.title-icon {
  width: 3rem;
  height: 3rem;
  color: #667eea;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.filters-section {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.filter-select, .filter-input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s;
  min-width: 150px;
}

.filter-select:focus, .filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: rgba(239, 68, 68, 0.1); 
  border-radius: 6px;
}

.icon-small {
  width: 20px;
  height: 20px;
  stroke: #ef4444; 
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.btn-clear svg {
  width: 1rem;
  height: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke-width: 2.5;
}

.stat-icon.entrada {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.stat-icon.salida {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.stat-icon.total {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 0.25rem;
}

.table-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  background: #f8fafc;
  color: #374151;
  padding: 1.5rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  border: none;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.th-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 2;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;
}

.table-row:hover {
  background: #f8fafc;
  transform: scale(1.01);
}

.modern-table td {
  padding: 1.25rem 1rem;
  vertical-align: middle;
  border: none;
}

.product-cell {
  min-width: 200px;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-name {
  font-weight: 600;
  color: #1f2937;
}


.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge svg {
  width: 0.875rem;
  height: 0.875rem;
  stroke-width: 2.5;
}

.badge-entrada {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #059669;
}

.badge-salida {
  background: linear-gradient(135deg, #fef2f2, #fecaca);
  color: #dc2626;
}

.quantity-cell {
  text-align: center;
}

.quantity {
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: inline-block;
  min-width: 80px;
}

.quantity.positive {
  background: #dcfce7;
  color: #059669;
}

.quantity.negative {
  background: #fef2f2;
  color: #dc2626;
}

.quantity.neutral {
  background: #f3f4f6;
  color: #6b7280;
}

.stock-cell {
  text-align: center;
  font-weight: 600;
  color: #374151;
}

.stock-new {
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  color: #4338ca;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 600;
}

.user-cell {
  min-width: 150px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.date-cell {
  min-width: 130px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date {
  font-weight: 600;
  color: #1f2937;
}

.time {
  font-size: 0.75rem;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
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

@media (max-width: 768px) {
  .historial-container {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .filters-section {
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .page-numbers {
    margin: 0;
  }
  
  .modern-table {
    font-size: 0.875rem;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 1rem 0.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .title-icon {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select,
  .filter-input {
    min-width: auto;
  }
  
  .btn-pagination {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .page-number {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }
}
</style>