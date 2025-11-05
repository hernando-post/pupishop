<template>
    <div class="mt-4 overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 text-left">Código</th>
            <th class="p-2 text-left">Producto</th>
            <th class="p-2 text-right">Stock</th>
            <th class="p-2 text-right">Cantidad</th>
            <th class="p-2 text-right">Precio Unit.</th>
            <th class="p-2 text-right">Subtotal</th>
            <th class="p-2"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.codigo" class="border-b">
            <!-- Contenido de la fila igual al original -->
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  defineProps({
    products: Array,
    hasStockErrors: Boolean
  })
  
  const emit = defineEmits(['update:quantity', 'remove'])
  </script>