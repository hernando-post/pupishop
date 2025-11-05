<!-- <template>
    <div>
        <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold">Lista de Administradores</h1>
            <button @click="redirectToCreateAdmin" class="text-green-500 hover:underline cursor-pointer">Crear
                Admin</button>
            <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Logout</button>
        </div>
        <div v-if="!adminLoading">
            <table class="table-auto">
                <thead>
                    <tr>
                        <th class="px-4 py-2">id</th>
                        <th class="px-4 py-2">Nombre</th>
                        <th class="px-4 py-2">Password</th>
                        <th class="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="admin in adminResult.Administradores" :key="admin.id_admin">
                        <td class="border px-4 py-2">{{ admin.id_admin }}</td>
                        <td class="border px-4 py-2">{{ admin.nombre }}</td>
                        <td class="border px-4 py-2">{{ admin.password }}</td>
                        <td class="border px-4 py-2">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                @click="editAdmin(admin.id_admin)">Editar</button>
                            <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                @click="handleDeleteAdmin(admin.id_admin)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <h1>no hay datos</h1>
        </div>

       
        <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div class="bg-white p-8 rounded shadow-lg">
                <h2 class="text-2xl mb-4">Editar Administrador</h2>
                <form @submit.prevent="submitUpdateAdmin">
                    <div class="mb-4">
                        <label class="block text-gray-700">Nombre</label>
                        <input v-model="editForm.nombre" class="border rounded w-full py-2 px-3" type="text" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700">Password</label>
                        <input v-model="editForm.password" class="border rounded w-full py-2 px-3" type="password" />
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
    loading: adminLoading,
    result: adminResult,
    refetch: adminRefetch
} = useQuery(gql`
    query GetAdministradores {
      Administradores {
        id_admin
        nombre
        password
      }
    }
  `)

const { mutate: deleteAdmin, onDone: deleteDone } = useMutation(gql`
    mutation MyMutation($id_admin: Int!) {
      delete_Administradores(where: {id_admin: {_eq: $id_admin}}) {
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
            text: 'Administrador borrado satisfactoriamente',
        });
        adminRefetch();
    }
})

const handleDeleteAdmin = (id_admin) => {
    deleteAdmin({ id_admin })
}

const redirectToCreateAdmin = () => {
    router.push('/crearadmin')
}

// Estado para el formulario de edición
const isEditing = ref(false)
const editForm = ref({
    id_admin: 0,
    nombre: '',
    password: ''
})

// Función para manejar la edición
const editAdmin = (admin) => {
    editForm.value = { ...admin }
    isEditing.value = true
}

const { mutate: updateAdminMutation, onDone: updateDone } = useMutation(gql`
    mutation MyMutation($id_admin: Int!, $nombre: String, $password: String) {
  update_Administradores_by_pk(pk_columns: {id_admin: $id_admin}, _set: {nombre: $nombre, password: $password}) {
    nombre
    password
  }
}

  `)

updateDone((result) => {
    if (result.errors) {
        console.error(result.errors);
        Swal.fire({
            icon: 'error',
            title: 'falla',
            text: 'algo esta fallando aqui'
        })
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Administrador actualizado satisfactoriamente',
        });
        adminRefetch();
        isEditing.value = false
    }
})

const submitUpdateAdmin = () => {
    updateAdminMutation({
        id_admin: editForm.value.id_admin,
        nombre: editForm.value.nombre,
        password: editForm.value.password
    })
}
</script> -->
<template>
  <div>
    <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold">Lista de Administradores</h1>
            <button @click="redirectToCreateAdmin" class="text-green-500 hover:underline cursor-pointer">Crear
                Admin</button>
            <button @click="logout" class="text-red-500 hover:underline cursor-pointer">Logout</button>
        </div>
    <div v-if="!adminLoading">
      <table class="table-auto">
        <thead>
          <tr>
            <th class="px-4 py-2">id</th>
            <th class="px-4 py-2">Nombre</th>
            <th class="px-4 py-2">Password</th>
            <th class="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="admin in adminResult.Administradores" :key="admin.id_admin">
            <td class="border px-4 py-2">{{ admin.id_admin }}</td>
            <td class="border px-4 py-2">{{ admin.nombre }}</td>
            <td class="border px-4 py-2">{{ admin.password }}</td>
            <td class="border px-4 py-2">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                @click="editAdmin(admin)">Editar</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                @click="handleDeleteAdmin(admin.id_admin)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de edición -->
    <div v-if="isEditing" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-8 rounded shadow-lg">
        <h2 class="text-2xl mb-4">Editar Administrador</h2>
        <form @submit.prevent="submitUpdateAdmin">
          <div class="mb-4">
            <label class="block text-gray-700">Nombre</label>
            <input v-model="editForm.nombre" class="border rounded w-full py-2 px-3" type="text" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700">Password</label>
            <input v-model="editForm.password" class="border rounded w-full py-2 px-3" type="password" />
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
  loading: adminLoading,
  result: adminResult,
  refetch: adminRefetch
} = useQuery(gql`
  query GetAdministradores {
    Administradores {
      id_admin
      nombre
      password
    }
  }
`)

const { mutate: deleteAdmin, onDone: deleteDone } = useMutation(gql`
  mutation MyMutation($id_admin: Int!) {
    delete_Administradores(where: {id_admin: {_eq: $id_admin}}) {
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
      text: 'Administrador borrado satisfactoriamente',
    });
    adminRefetch();
  }
})

const handleDeleteAdmin = (id_admin) => {
  deleteAdmin({ id_admin })
}

const redirectToCreateAdmin = () => {
  router.push('/crearadmin')
}

const isEditing = ref(false)
const editForm = ref({
  id_admin: 0,
  nombre: '',
  password: ''
})

const editAdmin = (admin) => {
  editForm.value = { ...admin }
  isEditing.value = true
}

const { mutate: updateAdminMutation, onDone: updateDone } = useMutation(gql`
  mutation MyMutation($id_admin: Int!, $nombre: String, $password: String) {
    update_Administradores_by_pk(pk_columns: {id_admin: $id_admin}, _set: {nombre: $nombre, password: $password}) {
      nombre
      password
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
      text: 'Administrador actualizado satisfactoriamente',
    });
    adminRefetch();
    isEditing.value = false
  }
})

const submitUpdateAdmin = () => {
  updateAdminMutation({
    id_admin: editForm.value.id_admin,
    nombre: editForm.value.nombre,
    password: editForm.value.password
  })
}
</script>
