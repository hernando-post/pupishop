<template>
    <div class="print-barcode">
      <div class="label-content">
        <div class="store-brand">{{ storeBrand }}</div>
        <div class="size">Talla: {{ size }}</div>
        <vue-barcode :value="barcodeValue" :options="barcodeOptions"></vue-barcode>
      </div>
      <button @click="print" class="print-button">Imprimir Etiqueta</button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import VueBarcode from '@chenfengyuan/vue-barcode';
  
  const props = defineProps({
    value: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    storeBrand: {
      type: String,
      required: true
    }
  });
  
  const barcodeValue = ref(props.value);
  const barcodeOptions = ref({
    width: 1.5,
    height: 30,
    displayValue: true,
    fontSize: 8
  });
  
  const print = () => {
    window.print();
  };
  
  onMounted(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-barcode, .print-barcode * {
          visibility: visible;
        }
        .print-barcode {
          position: absolute;
          left: 0;
          top: 0;
        }
        .print-button {
          display: none;
        }
        .label-content {
          width: 2.25in;
          height: 1.25in;
          padding: 0.125in;
          text-align: center;
          font-size: 10pt;
        }
        .store-brand {
          font-weight: bold;
          margin-bottom: 0.1in;
        }
        .size {
          margin-bottom: 0.1in;
        }
      }
    `;
    document.head.appendChild(style);
  });
  </script>
  
  <style scoped>
  .print-barcode {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .label-content {
    border: 1px dashed #ccc;
    padding: 10px;
    margin-bottom: 20px;
  }
  
  .store-brand {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .size {
    margin-bottom: 5px;
  }
  
  .print-button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .print-button:hover {
    background-color: #45a049;
  }
  </style>