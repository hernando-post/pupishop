<template>
    <div>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-4xl font-bold mb-4">Crear categoria</h1>
            <button @click="redirecToCategorias" class="text-green-500 hover:underline cursor-pointer">List Categorias</button>
            <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Logout</button>
        </div>
        <form @submit.prevent="handleCreateCategoria" class="w-full max-w-lg">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-nombre">
                        nombre:
                    </label>
                    <input id="Categoria-nombre" v-model="newCategoria.nombre" placeholder="nombre"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-descripcion">
                        descripcion:
                    </label>
                    <input id="Categoria-descripcion" v-model="newCategoria.descripcion" placeholder="descripcion"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <input type="submit" value="Create Categoria"
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



const router = useRouter()
const { signOut } = useSignOut()
const { userId } = useUserId()

const logout = () => {
    signOut()
    router.push('/login')
}

const newCategoria = ref({
    nombre: '',
    descripcion: ''
})

const { mutate: createCategoria, onDone: createDone } = useMutation(gql`
    mutation MyMutation($nombre: String, $descripcion: String) {
  insert_Categorias(objects: {nombre: $nombre, descripcion: $descripcion}) {
    affected_rows
    returning {
      id_categoria
      nombre
      descripcion
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
            text: 'Categoria creado satifactoriamente',
        });

    }
})
const handleCreateCategoria = async () => {
    if (!newCategoria.value.nombre ||  !newCategoria.value.descripcion) {
        return alert("Por favor llene todos los campos")
    }
    await createCategoria({
        nombre: newCategoria.value.nombre,
        descripcion: newCategoria.value.descripcion
    }
    )
    newCategoria.value = {
        nombre: '',
        descripcion: ''
    }

    redirecToCategorias();

}
const redirecToCategorias = () => {
    router.push('/categorias')
    router.afterEach(() => {
        window.location.reload();
    });
}
</script>