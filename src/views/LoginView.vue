<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo-container">
          <svg xmlns="http://www.w3.org/2000/svg" class="logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h2>Iniciar Sesión</h2>
        <p class="subtitle">Accede a tu cuenta para continuar</p>
      </div>

      <form @submit.prevent="iniciarSesion" class="login-form">
        <div class="form-group">
          <label for="email">
            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            Correo electrónico
          </label>
          <input 
            id="email"
            v-model="email" 
            type="email" 
            required 
            placeholder="ejemplo@correo.com"
            :class="{ 'error-input': error }"
          />
        </div>

        <div class="form-group">
          <label for="password">
            <svg xmlns="http://www.w3.org/2000/svg" class="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Contraseña
          </label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            placeholder="Ingresa tu contraseña"
            :class="{ 'error-input': error }"
          />
        </div>

        <button type="submit" class="login-btn" :disabled="!email || !password">
          <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
          </svg>
          Iniciar Sesión
        </button>

        <div v-if="error" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          {{ error }}
        </div>
      </form>

      <div class="login-footer">
        <p>¿Necesitas ayuda? <a href="#" class="help-link">Contacta soporte</a></p>
      </div>
    </div>
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
    error.value = '' 
    const token = await login(email.value, password.value)
    guardarToken(token)
    router.push('/productos')
  } catch (err) {
    error.value = 'Credenciales inválidas. Verifica tu email y contraseña.'
    console.error(err)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1rem;
}

.login-container {
  width: 450px;
  max-width: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 2.5rem 2rem 2rem;
  text-align: center;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 48px;
  height: 48px;
  stroke-width: 1.5;
}

.login-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.login-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.input-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  background: white;
}

.form-group input::placeholder {
  color: #9ca3af;
}

.error-input {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.error-input:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.login-btn {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.login-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.login-footer p {
  margin: 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.help-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.help-link:hover {
  color: #2563eb;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-page {
    padding: 0.5rem;
  }

  .login-container {
    max-width: 100%;
  }

  .login-header {
    padding: 2rem 1.5rem 1.5rem;
  }

  .login-form {
    padding: 1.5rem;
  }

  .login-footer {
    padding: 1rem 1.5rem;
  }

  .login-header h2 {
    font-size: 1.5rem;
  }
}
</style>