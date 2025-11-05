<template>
    <div id="qr-code-full-region"></div>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, defineEmits } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode';

const props = defineProps({
  qrbox: {
    type: Number,
    default: 250,
  },
  fps: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(['result']);

let html5QrcodeScanner = null; // Guardar referencia del escáner

const onScanSuccess = (decodedText, decodedResult) => {
  emit('result', decodedText, decodedResult);
};

onMounted(() => {
  const config = {
    fps: props.fps,
    qrbox: props.qrbox,
  };
  html5QrcodeScanner = new Html5QrcodeScanner('qr-code-full-region', config);
  html5QrcodeScanner.render(onScanSuccess);
});

// Limpiar cuando el componente se desmonte
onUnmounted(() => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(error => {
      console.error("Failed to clear html5QrcodeScanner", error);
    });
  }
});
</script>