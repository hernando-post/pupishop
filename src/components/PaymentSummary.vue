<template>
    <div class="w-80 bg-white p-4 rounded-lg shadow">
      <h3 class="text-xl font-bold mb-4">Resumen de Venta</h3>
      <div class="space-y-2">
        <!-- Detalles de subtotal, IVA y total -->
      </div>
      <button @click="$emit('checkout')" :disabled="disabled"
        class="w-full mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50">
        Proceder al Pago
      </button>
    </div>
  </template>
  
  <script setup>
  defineProps({
    subtotal: Number,
    iva: Number,
    total: Number,
    disabled: Boolean
  })
  </script>