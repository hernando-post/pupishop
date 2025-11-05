<template>
    <div>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold">Lista de Producto</h1>
            <button @click="redirectToCreateProducto" class="text-green-500 hover:underline cursor-pointer">Crear
                Producto</button>
            <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Logout</button>
        </div>
        <div v-if="!productoLoading">
            <table class="table-auto">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Serial</th>
                        <th class="px-4 py-2">Nombre</th>
                        <th class="px-4 py-2">Descripción</th>
                        <th class="px-4 py-2">Categoria</th>
                        <th class="px-4 py-2">Talla</th>
                        <th class="px-4 py-2">Stock</th>
                        <th class="px-4 py-2">Precio Compra</th>
                        <th class="px-4 py-2">Precio Venta</th>
                        <th class="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="producto in productoResult.Productos" :key="producto.barcode">
                        <td class="border px-4 py-2">{{ producto.barcode }}</td>
                        <td class="border px-4 py-2">{{ producto.nombre }}</td>
                        <td class="border px-4 py-2">{{ producto.descripcion }}</td>
                        <td class="border px-4 py-2">{{ producto.categoria }}</td>
                        <td class="border px-4 py-2">{{ producto.talla }}</td>
                        <td class="border px-4 py-2">{{ producto.stock }}</td>
                        <td class="border px-4 py-2">{{ producto.precio_compra }}</td>
                        <td class="border px-4 py-2">{{ producto.precio_compra }}</td>

                        <td class="border px-4 py-2">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                @click="editProducto(producto)">Editar</button>
                            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                @click="handleDeleteProducto(producto.barcode)">Delete</button>
                            <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                @click="handleCreateLabel(producto.barcode)">Etiqueta</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal de edición -->
        <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div class="bg-white p-8 rounded shadow-lg">
                <h2 class="text-2xl mb-4">Editar Producto</h2>
                <form @submit.prevent="submitUpdateProducto">
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
    loading: productoLoading,
    result: productoResult,
    refetch: productoRefetch
} = useQuery(gql`
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
    
  `)

const { mutate: deleteProducto, onDone: deleteDone } = useMutation(gql`
    mutation MyMutation($barcode: String!) {
      delete_Productos(where: {barcode: {_eq: $barcode}}) {
        affected_rows
      }
    }
  `)

deleteDone((result) => {
  if (result.errors) {
    console.error(result.errors);
  } else {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Producto borrado satisfactoriamente',
        });
        productoRefetch();
      }
    });
  }
});


const handleDeleteProducto = (barcode) => {
    deleteProducto({ barcode })
}

const handleCreateLabel =(barcode)=> {
    Swal.fire({
        icon: 'info',
        title:'Crear Etiqueta',
        text:'Aqui vendra la etiqueta para imprimir'
    })
}
const redirectToCreateProducto = () => {
    router.push('/crearproducto')
}

const isEditing = ref(false)
const editForm = ref({
    barcode: 0,
    nombre: '',
    descripcion: ''
})

const editProducto = (producto) => {
    editForm.value = { ...producto }
    isEditing.value = true
}

const { mutate: updateProductoMutation, onDone: updateDone } = useMutation(gql`
    mutation MyMutation($barcode: String, $nombre: String, $descripcion: String) {
      update_Productos_by_pk(pk_columns: {barcode: $barcode}, _set: {nombre: $nombre, descripcion: $descripcion}) {
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
            text: 'Producto actualizado satisfactoriamente',
        });
        productoRefetch();
        isEditing.value = false
    }
})

const submitUpdateProducto = () => {
    updateProductoMutation({
        barcode: editForm.value.barcode,
        nombre: editForm.value.nombre,
        descripcion: editForm.value.descripcion
    })
}
</script>