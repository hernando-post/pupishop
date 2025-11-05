<template>
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <div class="flex gap-4">
        <input 
          :value="identificacion" 
          @input="e => $emit('update:identificacion', e.target.value)"
          type="text" 
          placeholder="Identificación del cliente"
          class="flex-1 p-2 border rounded" 
          @keyup.enter="$emit('buscar')" 
        />
        <button 
          @click="$emit('buscar')" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Buscar Cliente
        </button>
      </div>
      <div v-if="cliente">
        <h3>Detalles del Cliente</h3>
        <p>Nombre: {{ cliente.nombre }}</p>
        <p>Celular: {{ cliente.celular }}</p>
        <p>Correo: {{ cliente.correo }}</p>
        <p>Crédito: {{ cliente.credito }}</p>
        <p>Cédula: {{ cliente.cedula }}</p>
        <p>Tope: {{ cliente.tope }}</p>
      </div>
      <div v-else-if="clienteLoading">
        <p>Cargando datos del cliente...</p>
      </div>
      <div v-else-if="clienteResult && clienteResult.Clientes.length === 0">
        <p>No se encontró ningún cliente hoy.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    identificacion: {
      type: [String, Number],
      default: ''
    },
    cliente: {
      type: Object,
      default: null
    },
    clienteLoading: {
      type: Boolean,
      default: false
    },
    clienteResult: {
      type: Object,
      default: null
    }
  });
  
  defineEmits(['update:identificacion', 'buscar']);
  </script>