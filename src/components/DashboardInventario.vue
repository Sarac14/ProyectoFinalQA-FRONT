<template>
  <div class="dashboard-container">
    <div class="header">
      <h2>Resumen general del inventario</h2>
    </div>

    <div class="metrics">
      <div class="card metric">
        <h3>Total de Productos</h3>
        <p>{{ stats.totalProductos }}</p>
      </div>
      <div class="card metric">
        <h3>Stock Total</h3>
        <p>{{ stats.stockTotal }}</p>
      </div>
      <div class="card metric">
        <h3>Tipos de Movimiento</h3>
        <p>{{ Object.keys(stats.movimientosPorTipo || {}).length }}</p>
      </div>
      <div class="card metric">
        <h3>Categorías</h3>
        <p>{{ Object.keys(stats.stockPorCategoria || {}).length }}</p>
      </div>
    </div>

    <div class="charts">
      <div class="chart-card">
        <h4>Movimientos por tipo</h4>
        <canvas id="movimientosChart"></canvas>
      </div>
      <div class="chart-card">
        <h4>Stock por categoría</h4>
        <canvas id="stockCategoriaChart"></canvas>
      </div>
    </div>

    <!-- <div class="recent-table">
      <h4>Últimos movimientos</h4>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Responsable</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mov in movimientos" :key="mov.id">
            <td>{{ mov.fechaMovimiento.split('T')[0] }}</td>
            <td>{{ mov.producto.nombre }}</td>
            <td>{{ mov.tipoMovimiento }}</td>
            <td>{{ mov.cantidad }}</td>
            <td>{{ mov.usuarioResponsable }}</td>
          </tr>
        </tbody>
      </table>
    </div> -->

    <div class="chart-card">
        <h4>Top productos por valor</h4>
        <canvas id="topProductosChart"></canvas>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { obtenerEstadisticas, obtenerMovimientos } from '@/services/inventarioService.js'
import { obtenerTopProductosPorValor } from '@/services/inventarioService.js'

const topProductos = ref([])
const stats = ref({})
const movimientos = ref([])

const fetchStats = async () => {
  try {
    stats.value = await obtenerEstadisticas()
    renderCharts()
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  }
}

const fetchMovimientos = async () => {
  try {
    const data = await obtenerMovimientos(0, 5)
    movimientos.value = data.content
  } catch (error) {
    console.error('Error cargando movimientos:', error)
  }
}

const fetchTopProductos = async () => {
  try {
    topProductos.value = await obtenerTopProductosPorValor()
    renderTopProductosChart()
  } catch (error) {
    console.error('Error cargando top productos:', error)
  }
}


const renderCharts = () => {
  const movimientosLabels = Object.keys(stats.value.movimientosPorTipo || {})
  const movimientosData = Object.values(stats.value.movimientosPorTipo || {})

  new Chart(document.getElementById('movimientosChart'), {
    type: 'bar',
    data: {
      labels: movimientosLabels,
      datasets: [{
        label: 'Movimientos',
        data: movimientosData,
        backgroundColor: '#6C63FF'
      }]
    },
    options: { responsive: true }
  })

  const catLabels = Object.keys(stats.value.stockPorCategoria || {})
  const catData = Object.values(stats.value.stockPorCategoria || {})

  new Chart(document.getElementById('stockCategoriaChart'), {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [{
        label: 'Stock',
        data: catData,
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC']
      }]
    },
    options: { responsive: true }
  })
}

const renderTopProductosChart = () => {
  const labels = topProductos.value.map(p => p.nombre)
  const data = topProductos.value.map(p => p.valorTotal)

  new Chart(document.getElementById('topProductosChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Valor Total ($)',
        data,
        backgroundColor: '#4CAF50'
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




onMounted(() => {
  fetchStats()
  fetchMovimientos()
  fetchTopProductos()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

canvas {
  max-width: 100%;
  height: auto;
}


#stockCategoriaChart {
  height: 300px;
  width: 50%;
  margin: auto;
  display: block;
}

/* #movimientosChart {
  max-height: 300px;
  max-width: 100%;
  margin: auto;
  display: block;
} */


.dashboard-container {
  min-height: 100vh;
  width: 100vw;
  padding: 20px;
  background-color: #f8f9fe;
  font-family: 'Segoe UI', sans-serif;
  overflow-x: hidden;
}

.header {
  margin-bottom: 30px;
}

.header h2 {
  font-size: 32px;
  margin-bottom: 8px;
  color: #222;
}

.header p {
  color: #888;
  font-size: 16px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin: 30px 0;
  width: 100%;
}

.metric {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  text-align: center;
  transition: transform 0.2s ease;
}

.metric:hover {
  transform: translateY(-2px);
}

.metric h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #555;
  font-weight: 500;
}

.metric p {
  font-size: 36px;
  font-weight: bold;
  color: #222;
}

.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 40px 0;
  width: 100%;
}

.chart-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  min-height: 400px;
}

.chart-card h4 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333;
  text-align: center;
}

#topProductosChart {
  height: 300px;
}


.recent-table {
  margin-top: 50px;
  width: 100%;
}

.recent-table h4 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.recent-table table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
}

.recent-table th {
  padding: 20px;
  text-align: left;
  border-bottom: 2px solid #eee;
  background-color: #f8f9fe;
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.recent-table td {
  padding: 18px 20px;
  text-align: left;
  border-bottom: 1px solid #eee;
  font-size: 15px;
}

.recent-table tr:hover {
  background-color: #f8f9fe;
}

.recent-table tr:last-child td {
  border-bottom: none;
}

@media (max-width: 1200px) {
  .charts {
    grid-template-columns: 1fr;
    gap: 25px;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 15px;
  }
  
  .metrics {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .metric {
    padding: 25px;
  }
  
  .metric p {
    font-size: 28px;
  }
  
  .chart-card {
    padding: 20px;
    min-height: 300px;
  }
  
  .header h2 {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .recent-table {
    overflow-x: auto;
  }
  
  .recent-table table {
    min-width: 600px;
  }
}
</style>