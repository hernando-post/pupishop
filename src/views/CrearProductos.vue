<template>
    
    <div>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-4xl font-bold mb-4">Crear Producto</h1>
            <button @click="redirecToProductos" class="text-green-500 hover:underline cursor-pointer">Lista de Productos</button>
            <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Logout</button>
        </div>
        <form @submit.prevent="handleCreateProducto" class="w-full max-w-lg">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-nombre">
                        Serial:
                    </label>
                    <input id="Producto-serial" v-model="newProducto.barcode" placeholder="serial"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-descripcion">
                        Nombre:
                    </label>
                    <input id="Producto-nombre" v-model="newProducto.nombre" placeholder="nombre"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-descripcion">
                        Descripción:
                    </label>
                    <input id="Producto-descripcion" v-model="newProducto.descripcion" placeholder="descripcion"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div>
                        <div v-if="categoriaResult">
                            <label for="categoria">Selecionar Categoria:</label>
                            <select id="categoria" v-model="newProducto.categoria"
                                class="w-full bg-white-200 border border-white-200 text-black text-xs py-3 px-4 pr-8 mb-3 rounded"
                                @change="onSelectUser">
                                <option value="">-- Escoja una categoria --</option>
                                <option v-for="categoria in categoriaResult.Categorias" :key="categoria.id"
                                    :value="categoria.nombre">
                                    {{ categoria.nombre }}</option>
                            </select>
                        </div>
                    </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-descripcion">
                        Talla:
                    </label>
                    <input id="Producto-talla" v-model="newProducto.talla" placeholder="talla"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-descripcion">
                        Cantidad:
                    </label>
                    <input id="Producto-stock" v-model="newProducto.stock" placeholder="stock"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-descripcion">
                        Precio Compra:
                    </label>
                    <input id="Producto-compra" v-model="newProducto.precio_compra" placeholder="compra"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-descripcion">
                        Precio Venta:
                    </label>
                    <input id="Producto-venta" v-model="newProducto.precio_venta" placeholder="venta"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <input type="submit" value="Create Producto"
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSignOut, useUserId } from '@nhost/vue'
import { useMutation, useQuery } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import Swal from 'sweetalert2'
import BarcodeGenerator from '@/components/BarcodeGenerator.vue'



const router = useRouter()
const { signOut } = useSignOut()
const { userId } = useUserId()

const logout = () => {
    signOut()
    router.push('/login')
}

const newProducto = ref({
    precio_compra: 0,
    precio_venta: 0,
    stock: 0,
    barcode:'',
    categoria:'',
    descripcion:'',
    nombre:'',
    talla:''
})

const { mutate: createProducto, onDone: createDone } = useMutation(gql`
    mutation InsertProductos($precio_compra: Int, $precio_venta: Int, $stock: Int, $barcode: String, $categoria: String, $descripcion: String, $nombre: String, $talla: String) {
  insert_Productos(objects: {precio_compra: $precio_compra, precio_venta: $precio_venta, stock: $stock, barcode: $barcode, categoria: $categoria, descripcion: $descripcion, nombre: $nombre, talla: $talla}) {
    affected_rows
    returning {
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
}
  `)

createDone((result) => {
    if (result.errors) {
        console.error(result.errors);
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Producto creado satifactoriamente',
        });

    }
})
const handleCreateProducto = async () => {
    if (!newProducto.value.barcode ||  !newProducto.value.nombre
     ||  !newProducto.value.precio_compra || !newProducto.value.precio_venta 
     ||  !newProducto.value.stock 
     ||  !newProducto.value.talla
     ) 
     {
        return alert("Por favor llene todos los campos")
    }
    await createProducto({
        barcode: newProducto.value.barcode,
        nombre: newProducto.value.nombre,
        categoria: newProducto.value.categoria,
        descripcion: newProducto.value.descripcion,
        stock: newProducto.value.stock,
        precio_compra: newProducto.value.precio_compra,
        precio_venta: newProducto.value.precio_venta,
        talla: newProducto.value.talla
    }
    )
    newProducto.value = {
        precio_compra: 0,
        precio_venta: 0,
        stock: 0,
        barcode:'',
        categoria:'',
        descripcion:'',
        nombre:'',
        talla:''
    }

    //redirecToProductos();

}
const redirecToProductos = () => {
    router.push('/Productos')
    router.afterEach(() => {
        window.location.reload();
    });
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
</script>