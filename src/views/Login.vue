<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50 to-accent-50 p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex justify-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-elevated">
          <span class="text-white font-bold text-3xl">P</span>
        </div>
      </div>

      <div class="card p-8">
        <h2 class="text-2xl font-bold text-center text-secondary-900 mb-2">Bienvenido a Pupishop</h2>
        <p class="text-center text-secondary-500 text-sm mb-8">Inicia sesión para continuar</p>

        <form @submit.prevent="registerOrLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1.5">Correo electrónico</label>
            <input 
              type="email" 
              v-model="email" 
              placeholder="tu@email.com"
              class="input-modern"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-1.5">Contraseña</label>
            <input 
              type="password" 
              v-model="password" 
              placeholder="••••••••"
              class="input-modern"
              autocomplete="current-password"
              required
            />
          </div>

          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="register" 
              v-model="isRegister"
              class="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <label for="register" class="ml-2 text-sm text-secondary-600 cursor-pointer select-none">
              ¿No tienes cuenta? Regístrate
            </label>
          </div>

          <button 
            type="submit" 
            class="btn-primary w-full text-base py-3"
            :disabled="loading"
          >
            <span v-if="loading" class="inline-flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Procesando...
            </span>
            <span v-else>{{ isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}</span>
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-secondary-400 mt-6">
        Pupishop POS © {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/vue';

const router = useRouter();
const isRegister = ref(false);
const email = ref('');
const password = ref('');
const loading = ref(false);

const { signInEmailPassword } = useSignInEmailPassword();
const { signUpEmailPassword } = useSignUpEmailPassword();

const registerOrLogin = async () => {
  if (!email.value || !password.value) return;
  loading.value = true;
  try {
    if (isRegister.value) {
      await signUpEmailPassword(email.value, password.value);
    } else {
      await signInEmailPassword(email.value, password.value);
    }
    localStorage.setItem('userEmail', email.value);
    router.push('/');
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
};
</script>