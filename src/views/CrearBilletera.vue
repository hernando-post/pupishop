

<template>
    <div>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-4xl font-bold mb-4">Crear Billetera</h1>
            <button @click="redirecToBilleteras" class="text-green-500 hover:underline cursor-pointer">List Billetera</button>
        </div>
        <form @submit.prevent="handleCreateBilletera" class="w-full max-w-lg">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="customer-billetera">
                        nombre:
                    </label>
                    <input id="Billetera-nombre" v-model="newBilletera.billetera" placeholder="nombre" @keyup.enter="focusNext('Billetera-valor')"  @keydown.enter.prevent
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="customer-valor">
                        valor:
                    </label>
                    <input id="Billetera-valor" v-model="newBilletera.valor" placeholder="valor" @keyup.enter="submit" 
                        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                    <input type="submit" value="Create Billetera" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSignOut, useUserId } from '@nhost/vue'
import { useMutation } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import Swal from 'sweetalert2'

const router = useRouter()
const { signOut } = useSignOut()
const { userId } = useUserId()

const logout = () => {
    signOut()
    router.push('/login')
}

const newBilletera = ref({
    billetera: '',
    valor: 0
})

const { mutate: createBilletera, onDone: createDone } = useMutation(gql`
    mutation InsertBilleteras($valor: Int, $billetera: String) {
  insert_Billeteras(objects: {valor: $valor, billetera: $billetera}) {
    affected_rows
    returning {
      id_billetera
			valor
			billetera
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
            text: 'Billetera creada satifactoriamente',
        });
    }
})

const handleCreateBilletera = async () => {
    if (!newBilletera.value.billetera || !newBilletera.value.valor) {
        return alert("Por favor llene todos los campos")
    }
    await createBilletera({
        billetera: newBilletera.value.billetera,
        valor: newBilletera.value.valor
    })
    newBilletera.value = {
        billetera: '',
        valor: ''
    }
    redirecToBilleteras();
}

const redirecToBilleteras = () => {
    router.push('/Billetera')
    router.afterEach(() => {
        window.location.reload();
    });
}

const focusNext = (nextInputId) => {
    const nextElement = document.getElementById(nextInputId);
    if (nextElement) {
        nextElement.focus();
    }
};
</script>
