<template>
    <div>
      <h1 class="text text-lg">Bienvenidos a nuestra App</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div v-for="(item, index) in animationItems" :key="index" class="text-center">
        <router-link 
          :to="item.route" 
          class="cursor-pointer block hover:opacity-80 transition-opacity"
        >
        <Vue3Lottie
          :animation-data="item.animation"
          :height="200"
          :width="200"
          :loop="true"
          :autoplay="true"
        />
        <h3 class="mt-2 font-bold">{{ item.title }}</h3>
        <p class="text-sm text-gray-600">{{ item.description }}</p>
      </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const animationItems = ref([])
  
  const items = [
    {
      url: 'https://lottie.host/4e4e68c9-4a42-4430-8bd9-8729b3db95a5/8XIj7jv57P.json',
      title: 'Ventas',
      description: 'Generar Venta',
      route: '/ventas'
  
    },
    {
      url: 'https://lottie.host/2091bafd-853a-43ae-a141-08ce80f5044e/lCAbgUUWW0.json',
      title: 'Inventario',
      description: 'Manejo de Inventario',
      route: '/productos'
    },
     {
      url: 'https://lottie.host/60cdb3d2-8f46-4693-a03a-032b55484a1d/GcsU2hEvTI.json',
      title: 'Clientes',
      description: 'Gestión de Clientes',
      route: '/cliente'
    }
    ,
     {
      url: 'https://lottie.host/e4a137e9-48cd-4302-b69b-ef4206dcadcf/NWtJLG7lIO.json',
      title: 'Administradores',
      description: 'Gestión de Administradores',
      route: '/admin'
    } 
    ,
     {
      url: 'https://lottie.host/70ed4c0b-8278-4e1d-b3cd-20598238d9ce/fREalmYfwJ.json',
      title: 'Billeteras Digitales',
      description: 'Medios de pago',
      route: '/billetera'
    } 
    ,
     {
      url: 'https://lottie.host/72f43a25-f1de-4a76-bce0-fe96c6c21ae5/5yv9mwsSWd.json',
      title: 'Categorias',
      description: 'Gestión de Categorias',
      route: '/categorias'
    } 
    ,
     {
      url: 'https://lottie.host/bd130f4e-4fac-415b-8847-aa6ba2fa8cf0/U1C5YWl3MN.json',
      title: 'Reportes',
      description: 'Bajo construcción',
      route: '/admin'
    } 
    ,
     {
      url: 'https://lottie.host/3db891ac-e40b-4ce3-b6ac-73d67ec86fcb/qfn2IzqnFV.json',
      title: 'Cuentas por Pagar',
      description: 'Cuentas por pagar',
      route: '/admin'
    } 
    ,
     {
      url: 'https://lottie.host/eabbc120-31f9-4cf4-be74-396cac16bdfd/0EFY3sbNIo.json',
      title: 'Gastos',
      description: 'Servicio publicos, etc',
      route: '/admin'
    } 
  ]
  
  onMounted(async () => {
    try {
      const loadedItems = await Promise.all(
        items.map(async item => {
          const response = await fetch(item.url)
          const animation = await response.json()
          return {
            ...item,
            animation
          }
        })
      )
      animationItems.value = loadedItems
    } catch (error) {
      console.error('Error cargando las animaciones:', error)
    }
  })
  </script>