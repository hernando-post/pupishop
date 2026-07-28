<template>
  <div class="page-container space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900">Dashboard Administrativo</h1>
        <p class="text-sm text-secondary-500 mt-1">Resumen general del negocio</p>
      </div>
      <div class="flex gap-2">
        <button @click="router.push('/Nventa')" class="btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Venta
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-500">Ventas Hoy</p>
            <p class="text-2xl font-bold text-secondary-900 mt-1">${{ stats.ventasHoy.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <div class="mt-3 flex items-center text-xs text-emerald-600">
          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
          </svg>
          <span>Actualizado ahora</span>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-500">Total Productos</p>
            <p class="text-2xl font-bold text-secondary-900 mt-1">{{ stats.totalProductos }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-500">Stock Bajo</p>
            <p class="text-2xl font-bold text-rose-600 mt-1">{{ stats.stockBajo }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-secondary-500">Clientes</p>
            <p class="text-2xl font-bold text-secondary-900 mt-1">{{ stats.totalClientes }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Ventas Recientes -->
      <div class="lg:col-span-2 card overflow-hidden">
        <div class="px-6 py-4 border-b border-secondary-100 flex items-center justify-between">
          <h3 class="font-semibold text-secondary-900">Ventas Recientes</h3>
          <button @click="router.push('/ventas')" class="text-sm text-primary-600 hover:text-primary-700 font-medium">Ver todas</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-secondary-500 uppercase bg-secondary-50/50">
              <tr>
                <th class="px-6 py-3">ID</th>
                <th class="px-6 py-3">Cliente</th>
                <th class="px-6 py-3">Fecha</th>
                <th class="px-6 py-3 text-right">Total</th>
                <th class="px-6 py-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-secondary-100">
              <tr v-for="venta in ventasRecientes" :key="venta.id_venta" class="hover:bg-secondary-50/50 transition-colors">
                <td class="px-6 py-3 font-medium text-secondary-900">#{{ venta.id_venta }}</td>
                <td class="px-6 py-3 text-secondary-600">{{ venta.cliente?.nombre || 'Cliente general' }}</td>
                <td class="px-6 py-3 text-secondary-500">{{ formatDate(venta.fecha) }}</td>
                <td class="px-6 py-3 text-right font-medium text-secondary-900">${{ venta.total?.toLocaleString() }}</td>
                <td class="px-6 py-3 text-center">
                  <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {{ venta.estado }}
                  </span>
                </td>
              </tr>
              <tr v-if="ventasLoading">
                <td colspan="5" class="px-6 py-8 text-center text-secondary-400">
                  Cargando ventas...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Accesos Rápidos -->
      <div class="space-y-4">
        <div class="card p-5">
          <h3 class="font-semibold text-secondary-900 mb-4">Accesos Rápidos</h3>
          <div class="space-y-2">
            <button v-for="item in quickAccess" :key="item.path" @click="router.push(item.path)"
              class="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary-50 transition-colors group text-left">
              <div :class="`w-10 h-10 rounded-lg ${item.bg} ${item.text} flex items-center justify-center group-hover:scale-110 transition-transform`">
                <component :is="item.icon" class="w-5 h-5"/>
              </div>
              <div>
                <p class="text-sm font-medium text-secondary-900">{{ item.label }}</p>
                <p class="text-xs text-secondary-500">{{ item.desc }}</p>
              </div>
              <svg class="w-4 h-4 text-secondary-400 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Productos con bajo stock -->
        <div class="card p-5">
          <h3 class="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            Stock Bajo
          </h3>
          <div v-if="productosBajoStock.length === 0" class="text-sm text-secondary-500 py-2">
            No hay productos con stock bajo
          </div>
          <div v-else class="space-y-2">
            <div v-for="prod in productosBajoStock" :key="prod.barcode" 
              class="flex items-center justify-between p-2 rounded-lg bg-rose-50/50 border border-rose-100">
              <div>
                <p class="text-sm font-medium text-secondary-900">{{ prod.nombre }}</p>
                <p class="text-xs text-secondary-500">{{ prod.categoria }}</p>
              </div>
              <span class="text-sm font-bold text-rose-600">{{ prod.stock }} uds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';

const router = useRouter();

// Iconos como componentes funcionales
const icons = {
  ventas: h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, 
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })),
  productos: h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })),
  clientes: h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })),
  categoria: h('svg', { class: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' })),
};

const quickAccess = [
  { path: '/ventas', label: 'Punto de Venta', desc: 'Crear nueva venta', bg: 'bg-primary-100', text: 'text-primary-600', icon: icons.ventas },
  { path: '/productos', label: 'Inventario', desc: 'Gestionar productos', bg: 'bg-accent-100', text: 'text-accent-600', icon: icons.productos },
  { path: '/cliente', label: 'Clientes', desc: 'Ver y crear clientes', bg: 'bg-violet-100', text: 'text-violet-600', icon: icons.clientes },
  { path: '/categorias', label: 'Categorías', desc: 'Organizar productos', bg: 'bg-amber-100', text: 'text-amber-600', icon: icons.categoria },
];

// Queries
const { result: ventasResult, loading: ventasLoading } = useQuery(gql`
  query GetRecentVentas {
    ventas(order_by: {fecha: desc}, limit: 5) {
      id_venta
      fecha
      total
      estado
      cliente {
        nombre
      }
    }
  }
`);

const { result: productosResult } = useQuery(gql`
  query GetProductosStats {
    Productos {
      barcode
      nombre
      stock
      categoria
      precio_venta
    }
  }
`);

const { result: clientesResult } = useQuery(gql`
  query GetClientesCount {
    Clientes_aggregate {
      aggregate {
        count
      }
    }
  }
`);

const ventasRecientes = computed(() => ventasResult.value?.ventas || []);
const productosBajoStock = computed(() => {
  const prods = productosResult.value?.Productos || [];
  return prods.filter(p => p.stock <= 5).slice(0, 5);
});

const stats = computed(() => {
  const prods = productosResult.value?.Productos || [];
  const ventas = ventasResult.value?.ventas || [];
  const clientesCount = clientesResult.value?.Clientes_aggregate?.aggregate?.count || 0;
  
  const hoy = new Date().toISOString().split('T')[0];
  const ventasHoy = ventas.filter(v => v.fecha?.startsWith(hoy));
  const totalHoy = ventasHoy.reduce((sum, v) => sum + (v.total || 0), 0);
  
  return {
    ventasHoy: totalHoy,
    totalProductos: prods.length,
    stockBajo: prods.filter(p => p.stock <= 5).length,
    totalClientes: clientesCount,
  };
});

const formatDate = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};
</script>