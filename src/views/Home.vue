<template>
  <!-- (mismo contenido que antes) -->
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSignOut, useUserId } from '@nhost/vue'
import { useQuery } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import Swal from 'sweetalert2';

const router = useRouter()
const { signOut } = useSignOut()
const { userId } = useUserId()

const email = ref('');
const savedEmail = localStorage.getItem('userEmail');
if (savedEmail) {
  email.value = savedEmail;
} else {
  console.error("No se encontró el correo electrónico en localStorage");
}

const logout = () => {
  signOut();
  router.push('/login');
}

const {
  loading: userLoading,
  result: userResult,
  refetch: userRefetch
} = useQuery(
  gql`
  query MyQuery($email: citext!) {
      users(where: {email: {_eq: $email}}) {
          defaultRole
          displayName
      }
  }
  `, 
  () => ({ email: email.value })
);

watch(email, async (newEmail) => {
  if (newEmail) {
    await nextTick();  // Esperar a que Vue.js complete las actualizaciones del DOM
    userRefetch({ email: newEmail });
  }
});

watch(userResult, async (newResult) => {
  if (newResult && newResult.users) {
    console.log(newResult.users);
    if (newResult.users.length > 0) {
      const user = newResult.users[0];
      console.log('Rol del usuario:', user.defaultRole);
      console.log('Nombre:', user.displayName);

      // Esperar a que Vue.js complete las actualizaciones del DOM antes de guardar en localStorage
      await nextTick();
      localStorage.setItem('Nombre', user.displayName);
      console.log("Nombre guardado en localStorage: " + localStorage.getItem('Nombre'));
      
      // Redirección explícita después de la carga del componente
      if (user.defaultRole === 'administrador') {
        router.push('/administrador');
      } else {
        router.push('/vendedor');
      }
    }
  }
});

onMounted(() => {
  if (userResult.value && userResult.value.users && userResult.value.users.length > 0) {
    const user = userResult.value.users[0];
    if (user.defaultRole === 'administrador') {
      router.push('/administrador');
    } else {
      router.push('/vendedor');
    }
  }
});

// También puedes manejar el estado de carga
watch(userLoading, (isLoading) => {
  if (isLoading) {
    console.log('Cargando datos del usuario...');
  }
});
</script>
