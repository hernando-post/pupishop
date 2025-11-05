import { ref, computed } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

export default function useProductos() {
  const productosVenta = ref([])
  const codigoBarras = ref('')
  
  const PRODUCTOS_QUERY = gql`
    query GetProductos {
      Productos {
        precio_compra
        precio_venta
        stock
        barcode
        categoria
        descripcion
        nombre
        talla
      }
    }
  `
  
  const { result: productoResult, refetch: productoRefetch } = useQuery(PRODUCTOS_QUERY)
  
  const hayErroresStock = computed(() => 
    productosVenta.value.some(item => item.cantidad > item.stock))
  
  const agregarProducto = (barcode) => {
    const producto = productoResult.value?.Productos?.find(p => p.barcode === barcode)
    if (producto) {
      // Lógica para agregar producto a la venta
    }
  }
  
  return {
    productosVenta,
    codigoBarras,
    hayErroresStock,
    agregarProducto
  }
}