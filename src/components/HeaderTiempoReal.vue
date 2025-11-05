<template>
    <div class="mb-4 bg-white p-4 rounded-lg shadow flex justify-between items-center">
      <h1 class="text-2xl font-bold">Nueva Venta</h1>
      <div class="text-right">
        <div class="text-lg">{{ fechaActual }}</div>
        <div class="text-2xl font-bold">{{ horaActual }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const fechaActual = ref('');
  const horaActual = ref('');
  let intervalReloj = null;
  
  const actualizarReloj = () => {
    const ahora = new Date();
    fechaActual.value = ahora.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    horaActual.value = ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  onMounted(() => {
    actualizarReloj();
    intervalReloj = setInterval(actualizarReloj, 1000);
  });
  
  onUnmounted(() => {
    if (intervalReloj) clearInterval(intervalReloj);
  });
  </script>