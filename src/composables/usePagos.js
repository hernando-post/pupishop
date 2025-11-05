import { ref, computed } from 'vue'

export default function usePagos() {
  const metodosPago = ref([
    { id: 1, nombre: 'Efectivo', monto: 0, seleccionado: true },
    { id: 2, nombre: 'Tarjeta', monto: 0, seleccionado: false },
    { id: 3, nombre: 'Crédito', monto: 0, seleccionado: false },
  ])
  
  const totalPagado = computed(() => 
    metodosPago.value.reduce((acc, metodo) => 
      acc + (metodo.seleccionado ? metodo.monto : 0), 0))
  
  const actualizarPagos = (totalVenta) => {
    // Lógica para actualizar montos de pago
  }
  
  return {
    metodosPago,
    totalPagado,
    actualizarPagos
  }
}