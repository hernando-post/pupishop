import { createRouter, createWebHistory } from 'vue-router'
import home from '../views/Home.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/Home.vue'),
             meta: {
                 protected: true
             }
        },
        {
            path: '/administrador',
            name: 'administrador',
            component: () => import('@/views/Administrador.vue'),
             meta: {
                 protected: true
             }
        },
        {
            path: '/vendedor',
            name: 'vendedor',
            component: () => import('@/views/Vendedor.vue'),
             meta: {
                 protected: true
             }
        },
        {
            path: '/Nventa',
            name: 'Nventa',
            component: () => import('@/views/NuevaVenta.vue'),
             meta: {
                 protected: true
             }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue'),
            meta: { hideNavbar: true }
        },
        {
            path: '/admin',
            name: 'admin',
            component: () => import('@/views/AdminView.vue'),
            meta: { protected: true }
        },
        {
            path: '/crearadmin',
            name: 'crearadmin',
            component: () => import('@/views/CrearAdmin.vue'),
            meta: { protected: true }
        },
        {
            path: '/billetera',
            name: 'billetera',
            component: () => import('@/views/BilleteraView.vue'),
            meta: { protected: true }
        },
        {
            path: '/ventas',
            name: 'ventas',
            component: () => import('@/views/Ventas.vue'),
            meta: { protected: true }
        },
        {
            path: '/crearbilletera',
            name: 'crearbilletera',
            component: () => import('@/views/CrearBilletera.vue'),
            meta: { protected: true }
        },
        {
            path: '/productos',
            name: 'productos',
            component: () => import('@/views/Productos.vue'),
            meta: { protected: true }
        },
                {
            path: '/crearproducto',
            name: 'crearproducto',
            component: () => import('@/views/CrearProductos.vue'),
            meta: { protected: true }
        },
        {
            path: '/categorias',
            name: 'categorias',
            component: () => import('@/views/Categorias.vue'),
            meta: { protected: true }
        },
        {
            path: '/crearcategoria',
            name: 'crearcategoria',
            component: () => import('@/views/CrearCategoria.vue'),
            meta: { protected: true }
        },
        {
            path: '/cliente',
            name: 'cliente',
            component: () => import('@/views/Clientes.vue'),
            meta: { protected: true }
        },
        {
            path: '/crearcliente',
            name: 'crearcliente',
            component: () => import('@/views/CrearCliente.vue'),
            meta: { protected: true }
        },
        {
            path: '/barcode',
            name: 'barcode',
            component: () => import('@/views/BarcodeScanner.vue'),
            meta: { protected: true }
        }


    ]
})

export default router
