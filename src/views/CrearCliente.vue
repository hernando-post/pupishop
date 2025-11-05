<template>
    <div>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-4xl font-bold mb-4">Crear cliente</h1>
            <button @click="redirecToClientes" class="text-green-500 hover:underline cursor-pointer">List
                Cliente</button>
            <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Logout</button>
        </div>
        <form @submit.prevent="handleCreateCliente" class="w-full max-w-lg">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-cedula">
                        Cedula:
                    </label>
                    <input id="Cliente-cedula" v-model="newCliente.cedula" placeholder="12345678" type="number"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-nombre">
                        nombre:
                    </label>
                    <input id="Cliente-nombre" v-model="newCliente.nombre" placeholder="nombre"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-correo">
                        correo:
                    </label>
                    <input id="Cliente-correo" v-model="newCliente.correo" placeholder="correo"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3  bg-red-600">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        for="customer-celular">
                        Celular:
                    </label>
                    <input id="Cliente-celular" v-model="newCliente.celular" placeholder="12345678" type="text"
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                        <h4>{{ newCliente.celular }}</h4>
                        <br>
                </div>
            </div>
            <div>
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            for="customer-credito">
                            <h3>Credito otorgado a la fecha:</h3>
                        </label>
                        <input id="Cliente-credito" v-model="newCliente.credito" placeholder="12345678" type="number"
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                    </div>
                </div>
            </div>
            <div>
                <div class="flex flex-wrap -mx-3 mb-6">
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            for="customer-credito">
                            <h3>Tope de credito máximo aprobado:</h3>
                        </label>
                        <input id="Cliente-credito" v-model="newCliente.tope" placeholder="12345678" type="number"
                            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                    </div>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <input type="submit" value="Create Cliente"
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

const newCliente = ref({
    id_cliente: 0,
    nombre: '',
    correo: '',
    cedula: 0,
    celular: '',
    credito: 0,
    tope: 0
})

const { mutate: createCliente, onDone: createDone } = useMutation(gql`
    mutation MyMutation($nombre: String, $correo: String, $cedula: Int!, $celular: String, $credito: Int!, $tope: Int!) {
  insert_Clientes(objects: {nombre: $nombre, correo: $correo, cedula: $cedula, credito: $credito, celular: $celular, tope: $tope}) {
    affected_rows
    returning {
      id_cliente
      nombre
      correo
      celular
      credito
      cedula
      tope
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
            text: 'Cliente creado satifactoriamente',
        });

    }
})
const handleCreateCliente = async () => {
    if (!newCliente.value.nombre || !newCliente.value.correo || !newCliente.value.cedula) {
        return alert("Por favor llene todos los campos")
    }
    await createCliente({
        nombre: newCliente.value.nombre,
        correo: newCliente.value.correo,
        cedula: newCliente.value.cedula,
        credito: newCliente.value.credito,
        celular: newCliente.value.celular,
        tope: newCliente.value.tope
    }
    )
    newCliente.value = {
        nombre: '',
        correo: '',
        celular: '',
        credito: 0,
        cedula: 0,
        tope:0
    }

    redirecToClientes();

}
const redirecToClientes = () => {
    router.push('/cliente')
    router.afterEach(() => {
        window.location.reload();
    });
}
</script>