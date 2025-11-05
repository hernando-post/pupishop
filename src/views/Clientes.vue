<template>
    <div>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold">Lista de Cliente</h1>
            <button @click="redirectToCreateCliente" class="text-green-500 hover:underline cursor-pointer">Crear
                Cliente</button>
            <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Logout</button>
        </div>
        <div v-if="!clienteLoading">
            <table class="table-auto">
                <thead>
                    <tr>
                        <th class="px-4 py-2">id</th>
                        <th class="px-4 py-2">Cedula</th>
                        <th class="px-4 py-2">Nombre</th>
                        <th class="px-4 py-2">Celular</th>
                        <th class="px-4 py-2">Correo</th>
                        <th class="px-4 py-2">Credito</th>
                        <th class="px-4 py-2">Tope de credito</th>
                        <th class="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cliente in clienteResult.Clientes" :key="cliente.id_cliente">
                        <td class="border px-4 py-2">{{ cliente.id_cliente }}</td>
                        <td class="border px-4 py-2">{{ cliente.cedula }}</td>
                        <td class="border px-4 py-2">{{ cliente.nombre }}</td>
                        <td class="border px-4 py-2">{{ cliente.celular }}</td>
                        <td class="border px-4 py-2">{{ cliente.correo }}</td>
                        <td class="border px-4 py-2">{{ cliente.credito }}</td>
                        <td class="border px-4 py-2">{{ cliente.tope }}</td>
                        <td class="border px-4 py-2">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                @click="editCliente(cliente)">Editar</button>
                            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                @click="handleDeleteCliente(cliente.id_cliente)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal de edición -->
        <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div class="bg-white p-8 rounded shadow-lg">
                <h2 class="text-2xl mb-4">Editar Cliente</h2>
                <form @submit.prevent="submitUpdateCliente">
                    <div class="mb-4">
                        <label class="block text-gray-700">Cedula</label>
                        <input v-model="editForm.cedula" class="border rounded w-full py-2 px-3" type="text" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Nombre</label>
                        <input v-model="editForm.nombre" class="border rounded w-full py-2 px-3" type="text" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Correo</label>
                        <input v-model="editForm.correo" class="border rounded w-full py-2 px-3" type="text" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">celular</label>
                        <input v-model="editForm.celular" class="border rounded w-full py-2 px-3" type="text" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">credito</label>
                        <input v-model="editForm.credito" class="border rounded w-full py-2 px-3" type="text" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Tope de Credito</label>
                        <input v-model="editForm.tope" class="border rounded w-full py-2 px-3" type="text" />
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
    loading: clienteLoading,
    result: clienteResult,
    refetch: clienteRefetch
} = useQuery(gql`
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
    
  `)

const { mutate: deleteCliente, onDone: deleteDone } = useMutation(gql`
    mutation MyMutation($id_cliente: Int!) {
      delete_Clientes(where: {id_cliente: {_eq: $id_cliente}}) {
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
            text: 'Cliente borrada satisfactoriamente',
        });
        clienteRefetch();
    }
})

const handleDeleteCliente = (id_cliente) => {
    deleteCliente({ id_cliente })
}

const redirectToCreateCliente = () => {
    router.push('/crearcliente')
}

const isEditing = ref(false)
const editForm = ref({
    id_cliente: 0,
    nombre: '',
    celular:"",
    correo:'',
    credito:0,
    cedula:0,
    tope:0
})

const editCliente = (cliente) => {
    editForm.value = { ...cliente }
    isEditing.value = true
}

const { mutate: updateClienteMutation, onDone: updateDone } = useMutation(gql`
    mutation MyMutation($id_cliente: Int!, $nombre: String, $celular: String, $correo: String, $credito:Int!, $cedula: Int!, $tope: Int!) {
      update_Clientes_by_pk(pk_columns: {cedula: $cedula}, _set: {nombre: $nombre, celular: $celular, correo: $correo, credito: $credito, tope: $tope, id_cliente: $id_cliente}) {
        nombre
        celular
        correo
        credito
        cedula
        tope
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
            text: 'Cliente actualizado satisfactoriamente',
        });
        clienteRefetch();
        isEditing.value = false
    }
})

const submitUpdateCliente = () => {
    updateClienteMutation({
        id_cliente: editForm.value.id_cliente,
        nombre: editForm.value.nombre,
        celular: editForm.value.celular,
        correo: editForm.value.correo,
        credito: editForm.value.credito,
        cedula: editForm.value.cedula,
        tope: editForm.value.tope
    })
}
//Crear sistema de abonos con fechas y valores correspondientes

</script>