<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="iniciarSesion">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="password" type="password" required />
      </div>
      <button type="submit">Entrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, guardarToken } from '@/services/authService'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function iniciarSesion() {
  try {
    const token = await login(email.value, password.value)
    guardarToken(token)
    router.push('/productos')
  } catch (err) {
    error.value = 'Credenciales inválidas'
    console.error(err)
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.form-group {
  margin-bottom: 1.25rem;
  text-align: left;
}

input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.9rem;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
