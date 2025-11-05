import { ref, computed } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

export default function useVentas() {
  const subtotal = ref(0)
  const iva = ref(0)
  const totalVenta = ref(0)
  
  const calcularTotales = (productos) => {
    subtotal.value = productos.reduce((acc, item) => acc + (item.cantidad * item.precio), 0)
    iva.value = subtotal.value * 0.19
    totalVenta.value = subtotal.value + iva.value
  }
  
  const CREATE_VENTA = gql`
    mutation CreateVenta($input: VentaInput!) {
      insert_Ventas_one(object: $input) {
        id_venta
        fecha
        total
      }
    }
  `
  
  const { mutate: crearVenta } = useMutation(CREATE_VENTA)
  
  const procesarVenta = async (ventaData) => {
    try {
      const { data } = await crearVenta({ variables: { input: ventaData } })
      return data.insert_Ventas_one
    } catch (error) {
      throw new Error('Error al procesar venta')
    }
  }
  
  return {
    subtotal,
    iva,
    totalVenta,
    calcularTotales,
    procesarVenta
  }
}