<template>
    <div class="w-80 bg-white p-4 rounded-lg shadow">
      <h3 class="text-xl font-bold mb-4">Resumen de Venta</h3>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span>Subtotal:</span>
          <span>${{ subtotal.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between">
          <span>IVA (19%):</span>
          <span>${{ iva.toLocaleString() }}</span>
        </div>
        <div class="flex justify-between text-xl font-bold border-t pt-2">
          <span>Total:</span>
          <span>${{ totalVenta.toLocaleString() }}</span>
        </div>
      </div>
  
      <button 
        @click="$emit('mostrarPago')" 
        :disabled="!hayProductos || hayErroresStock"
        class="w-full mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        Proceder al Pago
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    productosVenta: {
      type: Array,
      required: true
    },
    hayErroresStock: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['mostrarPago']);
  
  // Computed properties
  const subtotal = computed(() => {
    return props.productosVenta.reduce((total, item) => {
      return total + (item.cantidad * item.precio);
    }, 0);
  });
  
  const iva = computed(() => {
    return subtotal.value * 0.19;
  });
  
  const totalVenta = computed(() => {
    return subtotal.value + iva.value;
  });
  
  const hayProductos = computed(() => {
    return props.productosVenta.length > 0;
  });
  </script>