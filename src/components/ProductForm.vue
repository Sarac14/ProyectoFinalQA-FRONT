<template>
  <div class="form-container">
    <h2>Crear Producto</h2>
    <form @submit.prevent="guardarProducto">
    <div class="form-group spaced" v-for="key in camposTexto" :key="key">
      <label :for="key">{{ key.charAt(0).toUpperCase() + key.slice(1) }}</label>
      <template v-if="key === 'descripcion'">
        <textarea :id="key" v-model="producto[key]" required></textarea>
      </template>
      <template v-else-if="key === 'categoria'">
        <select :id="key" v-model="producto[key]" required>
          <option disabled value="">Seleccione una categoría</option>
          <option v-for="cat in categoriasDisponibles" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </template>
      <template v-else>
        <input
          :id="key"
          v-model="producto[key]"
          type="text"
          required
        />
      </template>
    </div>



      <div class="form-grid">
        <div class="form-group spaced">
          <label for="precio">Precio</label>
          <input id="precio" v-model="producto.precio" type="number" step="0.01" required />
        </div>
        <div class="form-group spaced">
          <label for="cantidad">Cantidad</label>
          <input id="cantidad" v-model="producto.cantidad" type="number" required />
        </div>
      </div>

      <div class="form-group spaced">
        <label for="minimoStock">Cantidad mínima</label>
        <input
          id="minimoStock"
          v-model="producto.minimoStock"
          type="number"
          min="0"
          required
        />
      </div>



      <button type="submit">Guardar</button>
    </form>

    <p v-if="mensaje" :class="['mensaje', esError ? 'error' : 'success']">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { crearProducto, obtenerProductoPorId, actualizarProducto, obtenerCategorias  } from '@/services/productoService'
import '@/styles/form.css'

const route = useRoute()
const router = useRouter()

const producto = ref({
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: null,
  cantidad: null,
  minimoStock: null
})

const camposTexto = ['nombre', 'descripcion', 'categoria']

const mensaje = ref('')
const modoEdicion = ref(false)
const categoriasDisponibles = ref([])
const esError = ref(false);


onMounted(async () => {
  categoriasDisponibles.value = await obtenerCategorias()
  const id = route.params.id
  if (id) {
    modoEdicion.value = true
    const data = await obtenerProductoPorId(id)
    producto.value = data
  }
})

async function guardarProducto() {
  try {
    if (modoEdicion.value) {
      await actualizarProducto(route.params.id, producto.value)
      mensaje.value = 'Producto actualizado correctamente.'
      esError.value = false;
    } else {
      await crearProducto(producto.value)
      mensaje.value = 'Producto creado exitosamente.'
    }
    setTimeout(() => router.push('/productos'), 1000)
  } catch (error) {
    esError.value = true;
    console.error(error);
    if (error.response && error.response.data && error.response.data.message) {
      mensaje.value = error.response.data.message;
    } else {
      mensaje.value = 'Ocurrió un error al guardar.';
    }
  }
}
</script>

