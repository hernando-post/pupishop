<template>
    <div>
      <div class="flex gap-4">
        <input v-model="manualBarcode" type="text" placeholder="Escanear código de barras"
          class="flex-1 p-2 border rounded" @keyup.enter="$emit('scan', manualBarcode)" />
        <button @click="toggleScanner"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center">
          <span v-if="!scannerActive">
            <!-- Icono de cámara -->
            Abrir Cámara
          </span>
          <span v-else>
            <!-- Icono de cerrar -->
            Detener Cámara
          </span>
        </button>
      </div>
  
      <div v-if="scannerActive" class="mt-4">
        <div id="reader" class="w-full max-w-sm mx-auto"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onUnmounted } from 'vue'
  import { Html5Qrcode } from "html5-qrcode"
  
  const emit = defineEmits(['scan'])
  const scannerActive = ref(false)
  const manualBarcode = ref('')
  let html5QrcodeScanner = null
  
  const toggleScanner = async () => {
    if (scannerActive.value) {
      await stopScanner()
    } else {
      await startScanner()
    }
  }
  
  const startScanner = async () => {
    try {
      html5QrcodeScanner = new Html5Qrcode("reader")
      await html5QrcodeScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        onScanSuccess,
        onScanError
      )
      scannerActive.value = true
    } catch (error) {
      console.error("Error starting scanner:", error)
    }
  }
  
  const stopScanner = async () => {
    try {
      if (html5QrcodeScanner) {
        await html5QrcodeScanner.stop()
        html5QrcodeScanner = null
      }
      scannerActive.value = false
    } catch (error) {
      console.error("Error stopping scanner:", error)
    }
  }
  
  const onScanSuccess = (decodedText) => {
    emit('scan', decodedText)
    stopScanner()
  }
  
  const onScanError = (error) => {
    console.warn(`Scan error: ${error}`)
  }
  
  onUnmounted(() => {
    stopScanner()
  })
  </script>