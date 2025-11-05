<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <!-- Contenido del modal igual al original -->
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    total: Number,
    paymentMethods: Array,
    totalPaid: Number,
    remaining: Number
  })
  
  const emit = defineEmits(['close', 'process'])
  </script>