<template>
    <div>
      <div class="flex items-center justify-between mb-8">
              <h1 class="text-3xl font-bold">Lista de Billeteras</h1>
              <button @click="redirectToCreateBilletera" class="text-green-500 hover:underline cursor-pointer">Crear
                  Billetera</button>
              
          </div>
      <div v-if="!billeteraLoading">
        <table class="table-auto">
          <thead>
            <tr>
              <th class="px-4 py-2">id</th>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">valor</th>
              <th class="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="billetera in billeteraResult.Billeteras" :key="billetera.id_billetera">
              <td class="border px-4 py-2">{{ billetera.id_billetera }}</td>
              <td class="border px-4 py-2">{{ billetera.billetera }}</td>
              <td class="border px-4 py-2">{{ billetera.valor }}</td>
              <td class="border px-4 py-2">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  @click="editBilletera(billetera)">Editar</button>
                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  @click="handleDeleteBilletera(billetera.id_billetera)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal de edición -->
      <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white p-8 rounded shadow-lg">
          <h2 class="text-2xl mb-4">Editar Billetera</h2>
          <form @submit.prevent="submitUpdateBilletera">
            <div class="mb-4">
              <label class="block text-gray-700">Nombre</label>
              <input v-model="editForm.nombre" class="border rounded w-full py-2 px-3" type="text" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700">valor</label>
              <input v-model="editForm.valor" class="border rounded w-full py-2 px-3" type="valor" />
            </div>
            <div class="flex justify-end">
              <button type="button" @click="isEditing = false"
                class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Cancelar</button>
              <button type="submit"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSignOut, useUserId } from '@nhost/vue'
  import { useQuery, useMutation } from "@vue/apollo-composable";
  import { gql } from "@apollo/client/core";
  import Swal from 'sweetalert2';
  
  const router = useRouter()
  const { signOut } = useSignOut()
  const { userId } = useUserId()
  
  const logout = () => {
    signOut()
    router.push('/login')
  }
  
  const {
    loading: billeteraLoading,
    result: billeteraResult,
    refetch: billeteraRefetch
  } = useQuery(gql`
    query GetBilleteras {
  Billeteras {
    id_billetera
		valor
		billetera
  }
}
    
  `)
  
  const { mutate: deleteBilletera, onDone: deleteDone } = useMutation(gql`
    mutation MyMutation($id_billetera: Int!) {
      delete_Billeteras(where: {id_billetera: {_eq: $id_billetera}}) {
        affected_rows
      }
    }
  `)
  
  deleteDone((result) => {
    if (result.errors) {
      console.error(result.errors);
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Billetera borrada satisfactoriamente',
      });
      billeteraRefetch();
    }
  })
  
  const handleDeleteBilletera = (id_billetera) => {
    deleteBilletera({ id_billetera })
  }
  
  const redirectToCreateBilletera = () => {
    router.push('/crearbilletera')
  }
  
  const isEditing = ref(false)
  const editForm = ref({
    id_billetera: 0,
    nombre: '',
    valor: ''
  })
  
  const editBilletera = (billetera) => {
    editForm.value = { ...billetera }
    isEditing.value = true
  }
  
  const { mutate: updateBilleteraMutation, onDone: updateDone } = useMutation(gql`
    mutation MyMutation($id_billetera: Int!, $nombre: String, $valor: String) {
      update_Billeteras_by_pk(pk_columns: {id_billetera: $id_billetera}, _set: {nombre: $nombre, valor: $valor}) {
        nombre
        valor
      }
    }
  `)
  
  updateDone((result) => {
    if (result.errors) {
      console.error(result.errors);
      Swal.fire({
        icon: 'error',
        title: 'Falla',
        text: 'Algo está fallando aquí'
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Billetera actualizada satisfactoriamente',
      });
      billeteraRefetch();
      isEditing.value = false
    }
  })
  
  const submitUpdateBilletera = () => {
    updateBilleteraMutation({
      id_billetera: editForm.value.id_billetera,
      nombre: editForm.value.nombre,
      valor: editForm.value.valor
    })
  }
  </script>
  