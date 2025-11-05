<template>
    <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="cerrarModal">
      <div class="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 class="text-xl font-bold mb-4">Método de Pago</h2>
  
        <div class="space-y-4">
          <!-- Efectivo -->
          <div class="border-b pb-4">
            <div class="flex items-center gap-4 mb-2">
              <input 
                type="number" 
                :value="metodosPagoLocal.find(m => m.id === 1)?.monto" 
                @input="actualizarMonto(metodosPagoLocal.find(m => m.id === 1), $event.target.value)"
                placeholder="Monto en efectivo"
                class="p-2 border rounded flex-1" 
                :disabled="!metodosPagoLocal.find(m => m.id === 1)?.seleccionado"
                min="0"
                step="any"
              />
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  :checked="metodosPagoLocal.find(m => m.id === 1)?.seleccionado"
                  @change="toggleMetodo(metodosPagoLocal.find(m => m.id === 1))"
                  class="cursor-pointer w-4 h-4"
                />
                <span class="whitespace-nowrap">Efectivo</span>
              </label>
            </div>
          </div>

          <!-- Billeteras Digitales -->
          <div class="border-b pb-4">
            <h3 class="font-semibold mb-2 text-gray-700">Billeteras Digitales</h3>
            <div v-for="metodo in metodosPagoLocal.filter(m => m.categoria === 'billetera')" :key="metodo.id" class="flex items-center gap-4 mb-2">
              <input 
                type="number" 
                :value="metodo.monto" 
                @input="actualizarMonto(metodo, $event.target.value)"
                :placeholder="`Monto en ${metodo.nombre}`"
                class="p-2 border rounded flex-1" 
                :disabled="!metodo.seleccionado"
                min="0"
                step="any"
              />
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  :checked="metodo.seleccionado"
                  @change="toggleMetodo(metodo)"
                  class="cursor-pointer w-4 h-4"
                />
                <span class="whitespace-nowrap">{{ metodo.nombre }}</span>
              </label>
            </div>
          </div>

          <!-- Tarjetas -->
          <div class="border-b pb-4">
            <h3 class="font-semibold mb-2 text-gray-700">Tarjetas</h3>
            <div v-for="metodo in metodosPagoLocal.filter(m => m.categoria === 'tarjeta')" :key="metodo.id" class="flex items-center gap-4 mb-2">
              <input 
                type="number" 
                :value="metodo.monto" 
                @input="actualizarMonto(metodo, $event.target.value)"
                :placeholder="`Monto en ${metodo.nombre}`"
                class="p-2 border rounded flex-1" 
                :disabled="!metodo.seleccionado"
                min="0"
                step="any"
              />
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  :checked="metodo.seleccionado"
                  @change="toggleMetodo(metodo)"
                  class="cursor-pointer w-4 h-4"
                />
                <span class="whitespace-nowrap">{{ metodo.nombre }}</span>
              </label>
            </div>
          </div>

          <!-- Crédito -->
          <div class="border-b pb-4">
            <h3 class="font-semibold mb-2 text-gray-700">Crédito</h3>
            <div class="flex items-center gap-4 mb-2">
              <input 
                type="number" 
                :value="metodosPagoLocal.find(m => m.id === 8)?.monto" 
                @input="actualizarMonto(metodosPagoLocal.find(m => m.id === 8), $event.target.value)"
                placeholder="Monto a crédito"
                class="p-2 border rounded flex-1" 
                :disabled="!metodosPagoLocal.find(m => m.id === 8)?.seleccionado"
                min="0"
                step="any"
              />
              <label class="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  :checked="metodosPagoLocal.find(m => m.id === 8)?.seleccionado"
                  @change="toggleMetodo(metodosPagoLocal.find(m => m.id === 8))"
                  class="cursor-pointer w-4 h-4"
                />
                <span class="whitespace-nowrap">Crédito</span>
              </label>
            </div>
            <div v-if="clienteActual && metodosPagoLocal.find(m => m.id === 8)?.seleccionado" class="text-xs text-gray-600 mt-1">
              Crédito disponible: ${{ (clienteActual.tope - clienteActual.credito).toLocaleString() }}
            </div>
          </div>
  
          <!-- Resumen del pago -->
          <div class="border-t pt-4 mt-4">
            <p class="flex justify-between">
              <span>Total a pagar:</span>
              <span class="font-semibold">${{ totalVenta.toLocaleString() }}</span>
            </p>
            <p class="flex justify-between">
              <span>Total pagado:</span>
              <span class="font-semibold">${{ totalPagado.toLocaleString() }}</span>
            </p>
            <p class="flex justify-between font-bold text-lg" :class="{'text-red-500': totalRestante > 0, 'text-green-500': totalRestante <= 0}">
              <span>{{ totalRestante > 0 ? 'Restante:' : 'Cambio:' }}</span>
              <span>${{ Math.abs(totalRestante).toLocaleString() }}</span>
            </p>
            
            <!-- Mostrar cambio a devolver cuando hay excedente -->
            <div v-if="totalRestante < 0" class="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded">
              <p class="text-yellow-800 font-semibold text-center">
                Cambio a devolver: ${{ Math.abs(totalRestante).toLocaleString() }}
              </p>
            </div>
          </div>
  
          <!-- Botones de acción -->
          <div class="flex justify-end gap-4 mt-4">
            <button 
              @click="cerrarModal" 
              class="px-4 py-2 border rounded hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button 
              @click="completarVenta" 
              :disabled="totalRestante > 0"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Completar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    totalVenta: {
      type: Number,
      required: true
    },
    clienteActual: {
      type: Object,
      default: null
    }
  });
  
  const emit = defineEmits(['cerrar', 'procesar', 'updateMetodosPago']);
  
  // Estado local del modal con más métodos de pago
  const metodosPagoLocal = ref([
    { id: 1, nombre: 'Efectivo', monto: 0, seleccionado: true, categoria: 'efectivo' },
    { id: 2, nombre: 'Nequi', monto: 0, seleccionado: false, categoria: 'billetera' },
    { id: 3, nombre: 'Daviplata', monto: 0, seleccionado: false, categoria: 'billetera' },
    { id: 4, nombre: 'BRE-B', monto: 0, seleccionado: false, categoria: 'billetera' },
    { id: 5, nombre: 'Visa', monto: 0, seleccionado: false, categoria: 'tarjeta' },
    { id: 6, nombre: 'Mastercard', monto: 0, seleccionado: false, categoria: 'tarjeta' },
    { id: 7, nombre: 'American Express', monto: 0, seleccionado: false, categoria: 'tarjeta' },
    { id: 8, nombre: 'Crédito', monto: 0, seleccionado: false, categoria: 'credito' },
  ]);
  
  // Inicializar cuando el modal se abre
  watch(() => props.visible, (newVal) => {
    if (newVal) {
      inicializarMetodosPago();
    }
  });
  
  const inicializarMetodosPago = () => {
    // Resetear todos los métodos
    metodosPagoLocal.value = metodosPagoLocal.value.map(metodo => ({
      ...metodo,
      monto: metodo.id === 1 ? props.totalVenta : 0,
      seleccionado: metodo.id === 1
    }));
    emitirCambios();
  };
  
  // Computed properties
  const totalPagado = computed(() => {
    return metodosPagoLocal.value.reduce((total, metodo) => {
      if (metodo.seleccionado) {
        const monto = parseFloat(metodo.monto) || 0;
        return total + monto;
      }
      return total;
    }, 0);
  });
  
  const totalRestante = computed(() => {
    return props.totalVenta - totalPagado.value;
  });
  
  const actualizarMonto = (metodo, valor) => {
    const nuevoMonto = parseFloat(valor) || 0;
    
    // Validar que no sea negativo
    if (nuevoMonto < 0) {
      metodo.monto = 0;
      emitirCambios();
      return;
    }
  
    // Validar límite de crédito
    if (metodo.nombre === 'Crédito' && props.clienteActual) {
      const creditoDisponible = props.clienteActual.tope - props.clienteActual.credito;
      if (nuevoMonto > creditoDisponible) {
        alert(`El crédito disponible es $${creditoDisponible.toLocaleString()}`);
        metodo.monto = creditoDisponible;
        emitirCambios();
        return;
      }
    }
    
    metodo.monto = nuevoMonto;
    emitirCambios();
  };
  
  const toggleMetodo = (metodo) => {
    // Solo cambiar el estado del método clickeado, no afectar los demás
    metodo.seleccionado = !metodo.seleccionado;
    
    if (!metodo.seleccionado) {
      // Si se desactiva, poner el monto en 0
      metodo.monto = 0;
    } else {
      // Si se activa, inicializar con 0 y dejar que el usuario ingrese el monto
      metodo.monto = 0;
      
      // Si es efectivo y es el único método seleccionado, poner el total
      if (metodo.nombre === 'Efectivo' && metodosPagoLocal.value.filter(m => m.seleccionado).length === 1) {
        metodo.monto = props.totalVenta;
      }
    }
    
    emitirCambios();
  };
  
  const emitirCambios = () => {
    // Crear una copia profunda para evitar mutaciones
    const copia = metodosPagoLocal.value.map(m => ({
      id: m.id,
      nombre: m.nombre,
      monto: parseFloat(m.monto) || 0,
      seleccionado: m.seleccionado,
      categoria: m.categoria
    }));
    emit('updateMetodosPago', copia);
  };
  
  const cerrarModal = () => {
    emit('cerrar');
  };
  
  const completarVenta = () => {
    console.log('ModalPagos: Completar venta clickeado');
    console.log('totalRestante:', totalRestante.value);
    
    if (totalRestante.value <= 0) {
        console.log('Emitiendo evento procesar');
        emit('procesar');
    } else {
        console.log('No se puede procesar - total restante:', totalRestante.value);
    }
  };
  </script>