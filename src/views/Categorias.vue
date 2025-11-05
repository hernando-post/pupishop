<template>
    <div>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold">Lista de Categoria</h1>
            <button @click="redirectToCreateCategoria" class="text-green-500 hover:underline cursor-pointer">Crear
                Categoria</button>
            <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Logout</button>
        </div>
        <div v-if="!categoriaLoading">
            <table class="table-auto">
                <thead>
                    <tr>
                        <th class="px-4 py-2">id</th>
                        <th class="px-4 py-2">Nombre</th>
                        <th class="px-4 py-2">Descripción</th>
                        <th class="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="categoria in categoriaResult.Categorias" :key="categoria.id_categoria">
                        <td class="border px-4 py-2">{{ categoria.id_categoria }}</td>
                        <td class="border px-4 py-2">{{ categoria.nombre }}</td>
                        <td class="border px-4 py-2">{{ categoria.descripcion }}</td>
                        <td class="border px-4 py-2">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                @click="editCategoria(categoria)">Editar</button>
                            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                @click="handleDeleteCategoria(categoria.id_categoria)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal de edición -->
        <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div class="bg-white p-8 rounded shadow-lg">
                <h2 class="text-2xl mb-4">Editar Categoria</h2>
                <form @submit.prevent="submitUpdateCategoria">
                    <div class="mb-4">
                        <label class="block text-gray-700">Nombre</label>
                        <input v-model="editForm.nombre" class="border rounded w-full py-2 px-3" type="text" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">descripcion</label>
                        <input v-model="editForm.descripcion" class="border rounded w-full py-2 px-3" type="text" />
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
    loading: categoriaLoading,
    result: categoriaResult,
    refetch: categoriaRefetch
} = useQuery(gql`
    query GetCategorias {
  Categorias {
    id_categoria
		descripcion
		nombre
  }
}
    
  `)

const { mutate: deleteCategoria, onDone: deleteDone } = useMutation(gql`
    mutation MyMutation($id_categoria: Int!) {
      delete_Categorias(where: {id_categoria: {_eq: $id_categoria}}) {
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
            text: 'Categoria borrada satisfactoriamente',
        });
        categoriaRefetch();
    }
})

const handleDeleteCategoria = (id_categoria) => {
    deleteCategoria({ id_categoria })
}

const redirectToCreateCategoria = () => {
    router.push('/crearcategoria')
}

const isEditing = ref(false)
const editForm = ref({
    id_categoria: 0,
    nombre: '',
    descripcion: ''
})

const editCategoria = (categoria) => {
    editForm.value = { ...categoria }
    isEditing.value = true
}

const { mutate: updateCategoriaMutation, onDone: updateDone } = useMutation(gql`
    mutation MyMutation($id_categoria: Int!, $nombre: String, $descripcion: String) {
      update_Categorias_by_pk(pk_columns: {id_categoria: $id_categoria}, _set: {nombre: $nombre, descripcion: $descripcion}) {
        nombre
        descripcion
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
            text: 'Categoria actualizado satisfactoriamente',
        });
        categoriaRefetch();
        isEditing.value = false
    }
})

const submitUpdateCategoria = () => {
    updateCategoriaMutation({
        id_categoria: editForm.value.id_categoria,
        nombre: editForm.value.nombre,
        descripcion: editForm.value.descripcion
    })
}
</script>