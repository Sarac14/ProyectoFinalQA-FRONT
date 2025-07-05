<template>
  <div class="user-admin-container">
    <div class="header">
      <h2>Gestión de Usuarios</h2>
      <button @click="mostrarCrear = true" class="btn btn-primary create-btn">
        <span class="icon">+</span>
        Crear Usuario
      </button>
    </div>

    <div v-if="usuarios.length" class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.nombre }}</td>
            <td>{{ usuario.apellido }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.rolNombre }}</td>
            <td>
              <span :class="['status', usuario.estado.toLowerCase()]">
                {{ usuario.estado }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button 
                  @click="bloquearUsuario(usuario)" 
                  v-if="usuario.estado !== 'BLOQUEADO'"
                  class="icon-btn"
                  title="Bloquear usuario"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </button>
                <button 
                  @click="desbloquearUsuario(usuario)" 
                  v-if="usuario.estado === 'BLOQUEADO'"
                  class="icon-btn"
                  title="Desbloquear usuario"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button 
                  @click="eliminar(usuario.id)" 
                  class="icon-btn"
                  title="Eliminar usuario"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!usuarios.length" class="empty-state">
      <p>No hay usuarios registrados</p>
    </div>

    <div v-if="mostrarCrear" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Crear Usuario</h3>
          <button @click="mostrarCrear = false" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="crear" class="form">
          <div class="form-group">
            <label>Nombre</label>
            <input 
              v-model="nuevoUsuario.nombre" 
              placeholder="Ingresa el nombre" 
              required 
            />
          </div>
          <div class="form-group">
            <label>Apellido</label>
            <input 
              v-model="nuevoUsuario.apellido" 
              placeholder="Ingresa el apellido" 
              required 
            />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input 
              v-model="nuevoUsuario.email" 
              placeholder="ejemplo@correo.com" 
              required 
              type="email" 
            />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input 
              v-model="nuevoUsuario.password" 
              placeholder="Contraseña segura" 
              required 
              type="password" 
            />
          </div>
          <div class="form-group">
            <label>ID Rol</label>
            <input 
              v-model="nuevoUsuario.idRol" 
              placeholder="ID del rol" 
              required 
              type="number" 
            />
          </div>
          <div class="form-actions">
            <button type="button" @click="mostrarCrear = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              Crear Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { obtenerUsuarios, crearUsuario, actualizarEstadoUsuario, eliminarUsuario } from '@/services/usuarioService';

const usuarios = ref([]);
const mostrarCrear = ref(false);
const nuevoUsuario = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  idRol: ''
});

const cargarUsuarios = async () => {
  usuarios.value = await obtenerUsuarios();
};

const crear = async () => {
  await crearUsuario(nuevoUsuario.value);
  mostrarCrear.value = false;
  nuevoUsuario.value = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    idRol: ''
  };
  await cargarUsuarios();
};

const bloquearUsuario = async (usuario) => {
  await actualizarEstadoUsuario(usuario.id, 'BLOQUEADO');
  await cargarUsuarios();
};

const desbloquearUsuario = async (usuario) => {
  await actualizarEstadoUsuario(usuario.id, 'ACTIVO');
  await cargarUsuarios();
};

const eliminar = async (id) => {
  if (confirm('¿Seguro de eliminar este usuario?')) {
    await eliminarUsuario(id);
    await cargarUsuarios();
  }
};

onMounted(cargarUsuarios);
</script>

<style scoped>
.user-admin-container {
  max-width: 95vw;
  min-height: 90vh;
  margin: 1rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.header h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.875rem;
  font-weight: 600;
}

.btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-warning {
  background: #f59e0b;
  color: white;
}

.btn-warning:hover {
  background: #d97706;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

.create-btn {
  max-width: 200px;
  white-space: nowrap;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(1.05);
}

.icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.icon-warning {
  color: #f59e0b;
}

.icon-success {
  color: #10b981;
}

.icon-danger {
  color: #ef4444;
}

.icon-btn:hover .icon-warning {
  color: #d97706;
}

.icon-btn:hover .icon-success {
  color: #059669;
}

.icon-btn:hover .icon-danger {
  color: #dc2626;
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  height: 60vh;
  overflow-y: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.user-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  padding: 1.5rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 1;
}

.user-table td {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.user-table tr:hover {
  background: #f8fafc;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status.activo {
  background: #dcfce7;
  color: #166534;
}

.status.bloqueado {
  background: #fef2f2;
  color: #991b1b;
}

.actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
}

.actions .btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  margin: 1rem;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #374151;
}

.form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .user-admin-container {
    margin: 0.5rem;
    padding: 1rem;
    max-width: 98vw;
    min-height: 95vh;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .actions {
    justify-content: flex-start;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .table-container {
    height: 70vh;
  }
  
  .user-table th,
  .user-table td {
    padding: 0.75rem;
  }
}
</style>