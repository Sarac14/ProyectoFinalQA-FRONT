<template>
  <div class="list-container">
    <h2>Lista de Productos</h2>

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
            <button @click="editarProducto(producto.id)" title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2l-6 6M6 18h.01M6 18l3-3m0 0l9-9m0 0a2.121 2.121 0 113-3 2.121 2.121 0 01-3 3z" />
                </svg>
            </button>
            <button @click="eliminarProducto(producto.id)" title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon delete" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3h10z" />
                </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { obtenerProductos, eliminarProductoPorId } from '@/services/productoService'
import { useRouter } from 'vue-router'

const productos = ref([])
const router = useRouter()

async function cargarProductos() {
  productos.value = await obtenerProductos()
}

async function eliminarProducto(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    await eliminarProductoPorId(id)
    await cargarProductos()
  }
}

function editarProducto(id) {
  router.push(`/editar/${id}`)
}

onMounted(cargarProductos)
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

h2 {
  text-align: center;
  font-size: 1.8rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
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

button:hover .icon {
  transform: scale(1.15);
  opacity: 0.8;
}

</style>
