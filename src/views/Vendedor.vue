<template>
  <div class="page-container space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-secondary-900">Panel de Vendedor</h1>
        <p class="text-sm text-secondary-500 mt-1">Bienvenido de vuelta, {{ userName }}</p>
      </div>
      <button @click="router.push('/Nventa')" class="btn-primary shadow-lg shadow-primary-500/25">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Nueva Venta
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card p-5 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
        <p class="text-primary-100 text-sm font-medium">Ventas Hoy</p>
        <p class="text-3xl font-bold mt-1">${{ stats.ventasHoy.toLocaleString() }}</p>
        <div class="mt-2 text-xs text-primary-200">{{ stats.cantidadVentas }} ventas realizadas</div>
      </div>

      <div class="card p-5">
        <p class="text-secondary-500 text-sm font-medium">Productos Disponibles</p>
        <p class="text-3xl font-bold text-secondary-900 mt-1">{{ stats.totalProductos }}</p>
      </div>

      <div class="card p-5">
        <p class="text-secondary-500 text-sm font-medium">Alertas de Stock</p>
        <p class="text-3xl font-bold text-rose-600 mt-1">{{ stats.stockBajo }}</p>
        <p v-if="stats.stockBajo > 0" class="text-xs text-rose-500 mt-1">Requiere atención</p>
      </div>
    </div>

    <!-- Acciones rápidas -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <button v-for="action in actions" :key="action.path" @click="router.push(action.path)"
        class="card p-4 text-center hover:bg-secondary-50 transition-colors group">
        <div :class="`w-12 h-12 mx-auto rounded-xl ${action.bg} ${action.text} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`">
          <component :is="action.icon" class="w-6 h-6"/>
        </div>
        <p class="text-sm font-medium text-secondary-900">{{ action.label }}</p>
      </button>
    </div>

    <!-- Ventas recientes del vendedor -->
    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-secondary-100">
        <h3 class="font-semibold text-secondary-900">Mis Ventas Recientes</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-xs text-secondary-500 uppercase bg-secondary-50/50">
            <tr>
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">Fecha</th>
              <th class="px-6 py-3 text-right">Total</th>
              <th class="px-6 py-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-secondary-100">
            <tr v-for="venta in ventasRecientes" :key="venta.id_venta" class="hover:bg-secondary-50/50">
              <td class="px-6 py-3 font-medium text-secondary-900">#{{ venta.id_venta }}</td>
              <td class="px-6 py-3 text-secondary-600">{{ formatDate(venta.fecha) }}</td>
              <td class="px-6 py-3 text-right font-medium">${{ venta.total?.toLocaleString() }}</td>
              <td class="px-6 py-3 text-center">
                <span class="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {{ venta.estado }}
                </span>
              </td>
            </tr>
            <tr v-if="ventasRecientes.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-secondary-400">No hay ventas recientes</td>
            </tr>
          </tbody>
        </table>
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
const userName = localStorage.getItem('Nombre') || 'Vendedor';

const icons = {
  venta: h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' })),
  historial: h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })),
  productos: h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' })),
  cliente: h('svg', { class: 'w-6 h-6', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' })),
};

const actions = [
  { path: '/Nventa', label: 'Nueva Venta', bg: 'bg-primary-100', text: 'text-primary-600', icon: icons.venta },
  { path: '/ventas', label: 'Historial', bg: 'bg-secondary-100', text: 'text-secondary-600', icon: icons.historial },
  { path: '/productos', label: 'Productos', bg: 'bg-accent-100', text: 'text-accent-600', icon: icons.productos },
  { path: '/cliente', label: 'Clientes', bg: 'bg-violet-100', text: 'text-violet-600', icon: icons.cliente },
];

const { result: ventasResult } = useQuery(gql`
  query GetMisVentas {
    ventas(order_by: {fecha: desc}, limit: 10) {
      id_venta
      fecha
      total
      estado
    }
  }
`);

const { result: productosResult } = useQuery(gql`
  query GetProductosVendedor {
    Productos {
      stock
    }
  }
`);

const ventasRecientes = computed(() => ventasResult.value?.ventas || []);
const stats = computed(() => {
  const ventas = ventasResult.value?.ventas || [];
  const prods = productosResult.value?.Productos || [];
  const hoy = new Date().toISOString().split('T')[0];
  const ventasHoy = ventas.filter(v => v.fecha?.startsWith(hoy));
  
  return {
    ventasHoy: ventasHoy.reduce((sum, v) => sum + (v.total || 0), 0),
    cantidadVentas: ventasHoy.length,
    totalProductos: prods.length,
    stockBajo: prods.filter(p => p.stock <= 5).length,
  };
});

const formatDate = (fecha) => {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};
</script>