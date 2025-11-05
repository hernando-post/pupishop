import { ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

export default function useClientes() {
  const identificacionCliente = ref('')
  const clienteActual = ref(null)
  
  const CLIENTES_QUERY = gql`
    query GetClientes {
      Clientes {
        id_cliente
        nombre
        celular
        correo
        credito
        cedula
        tope
      }
    }
  `
  
  const { result: clienteResult, loading: clienteLoading, refetch: clienteRefetch } = useQuery(CLIENTES_QUERY)
  
  const buscarCliente = (cedula) => {
    const cliente = clienteResult.value?.Clientes?.find(c => c.cedula == cedula)
    clienteActual.value = cliente ? { ...cliente } : null
    return cliente
  }
  
  return {
    identificacionCliente,
    clienteActual,
    clienteLoading,
    buscarCliente
  }
}
