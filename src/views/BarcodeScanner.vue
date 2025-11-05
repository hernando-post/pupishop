<template>
  <div>
    <button @click="startScanning">Open Camera</button>
    <qrcode-scanner
      :qrbox="250"
      :fps="10"
      style="width: 500px;"
      @result="onScan"
      v-if="isScanning"
    />
    <p v-if="scannedCode">Código Escaneado: {{ scannedCode }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import QrcodeScanner from '@/components/qrcode-scanner.vue';

const scannedCode = ref('');
const isScanning = ref(false);

const startScanning = () => {
  isScanning.value = true;
};

const onScan = (decodedText, decodedResult) => {
  // Guardar el resultado en la variable
  scannedCode.value = decodedText;
  // Mostrar el resultado escaneado en un Swal
  Swal.fire({
    title: 'Código escaneado',
    text: `Código: ${decodedText}`,
    icon: 'success',
  });
  isScanning.value = false;
  // Detener el escáner
};
</script>

<style scoped>
/* Add any custom styling you need here */
</style>
