<template>
  <nav class="bg-emerald-900 text-white shadow-lg p-3">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center max-w-7xl mx-auto">
      <div class="text-center sm:text-left">
        <h1 class="text-xl sm:text-3xl font-extrabold tracking-wider text-rose-300">
          Pupishop
        </h1>
      </div>

      <div class="text-center text-sm sm:text-base">
        <span>Bienvenido, **{{ userName }}**</span>
      </div>

      <div class="flex justify-center sm:justify-end space-x-4">
        <button 
          @click="inicio" 
          class="px-3 py-1 rounded-full text-sm font-medium transition duration-150 ease-in-out 
                 bg-teal-600 hover:bg-teal-500 text-white shadow-md">
          Inicio
        </button>
        
        <button 
          @click="logout" 
          class="px-3 py-1 rounded-full text-sm font-medium transition duration-150 ease-in-out 
                 text-red-400 hover:text-red-300 hover:underline cursor-pointer">
          Salir
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useSignOut } from '@nhost/vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const userName = ref('');

// Recuperar el nombre del `localStorage` cuando se monta el componente
onMounted(() => {
  const savedName = localStorage.getItem('Nombre');
  if (savedName) {
    userName.value = savedName;
  }
});

const { signOut } = useSignOut()
const router = useRouter()

const logout = () => {
  signOut()
  router.push('/login')
}

const inicio = () => {
  router.push('/')
}
</script>