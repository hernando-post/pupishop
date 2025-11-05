<template>
  <main
    class="bg-gradient-to-r from-pink-500 via-blue-500 to-blue-700 h-screen flex items-center justify-center">
    <div class="w-full max-w-md p-8  bg-white rounded-lg">
      <div class="flex justify-center">
        <img :src="localImage" class="w-24"></img>
      </div>

      <form @submit.prevent="registerOrLogin" class="space-y-4">
        
        <label class="block text-customColor-azulc">
          <input type="checkbox" v-model="isRegister" class="mr-2" />
          ¿Registrarse?
        </label>
        <label class="block">
          <span class="block text-sm uppercase mb-2  text-customColor-azulc">Email:</span>
          <input type="email" v-model="email" placeholder="Enter your email"
            class="block w-full text-slate-800 px-4 py-2 rounded-md" />
        </label>
        <label class="block">
          <span class="block text-sm uppercase mb-2  text-customColor-azulc">Contraseña:</span>
          
          <input type="password" autocomplete="current-password" v-model="password" placeholder="Enter your password"
            class="block w-full text-slate-800 px-4 py-2 rounded-md" @keyup.enter="submit" />
        </label>
        <input type="submit" value="Iniciar Sesión"
          class="bg-white rounded w-full py-2  text-customColor-azulitos hover:underline cursor-pointer" />
      </form>
    </div>
  </main>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useNhostClient } from '@nhost/vue'; 
const { nhost } = useNhostClient();
const router = useRouter()
const isRegister = ref(false)
const email = ref('')
const password = ref('')
import localImage from '@/assets/logo.png';

const localImageRef = ref(localImage);

const registerOrLogin = async () => {
  if (!email.value || !password.value) {
    return alert("Por favor llene todos los campos")
  }
  try {
    localStorage.setItem('userEmail', email.value);
    router.push('/');
  } catch (error) {
    alert(error.message);
  }
 
}

</script>
<style scoped>
body {
  background: linear-gradient(135deg, #ff6f61, #00bcd4);
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>