<template>
        
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class=" bg-red-900 sm:bg-green-600">
                    <h1 class="text-sm sm:text-5xl text-center font-bold">Pupishop</h1>

                </div>
                <div class="">
                    <span>Bienvenido, {{ userName }}</span>
                </div>
                <div class=" bg-slate-950 sm:bg-green-900">
                    <button @click="inicio">Inicio</button>
                    <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Salir</button>

                </div>
            </div>
       
    
</template>

<script setup>
import { useSignOut, useUserId } from '@nhost/vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const userName = ref('');

// Recuperar el nombre del `localStorage` cuando se monta el componente del navbar
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

const inicio =()=>{
 router.push('/')
}
</script>