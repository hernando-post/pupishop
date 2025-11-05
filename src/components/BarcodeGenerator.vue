<template>
  <div>
    <input v-model="id" placeholder="Ingrese el ID" class="border p-2 rounded mb-2" />
    <input v-model="size" placeholder="Ingrese la talla" class="border p-2 rounded mb-2" />
    <input v-model="storeBrand" placeholder="Ingrese la marca de la tienda" class="border p-2 rounded mb-2" />
    <button @click="generateBarcode" class="bg-blue-500 text-white px-4 py-2 rounded mt-2">Generar Etiqueta</button>
    <div v-if="showPrintComponent">
      <PrintBarcodeComponent :value="barcodeValue" :size="size" :storeBrand="storeBrand" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PrintBarcodeComponent from './PrintBarcodeComponent.vue';

const id = ref('');
const size = ref('');
const storeBrand = ref('');
const barcodeValue = ref('');
const showPrintComponent = ref(false);

const generateBarcode = () => {
  barcodeValue.value = id.value;
  showPrintComponent.value = true;
};
</script>