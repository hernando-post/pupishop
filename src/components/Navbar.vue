<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-secondary-200/60">
    <div class="page-container">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-soft">
            <span class="text-white font-bold text-lg">P</span>
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 hidden sm:block">
            Pupishop
          </span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-1">
          <button v-for="item in menuItems" :key="item.path" @click="router.push(item.path)"
            :class="[
              'px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
              $route.path === item.path 
                ? 'bg-primary-50 text-primary-700' 
                : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100/50'
            ]">
            {{ item.label }}
          </button>
        </div>

        <!-- User & Mobile Toggle -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-100/50 border border-secondary-200/50">
            <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span class="text-xs font-medium text-secondary-700">{{ userName || 'Usuario' }}</span>
          </div>
          
          <button @click="logout" class="p-2 rounded-lg text-secondary-500 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Salir">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>

          <!-- Mobile menu button -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100">
            <svg v-if="!mobileOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="mobileOpen" class="md:hidden border-t border-secondary-200/60 bg-white/95 backdrop-blur-xl">
      <div class="px-4 py-3 space-y-1">
        <button v-for="item in menuItems" :key="item.path" @click="goTo(item.path)"
          :class="[
            'w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            $route.path === item.path 
              ? 'bg-primary-50 text-primary-700' 
              : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
          ]">
          {{ item.label }}
        </button>
        <div class="pt-2 border-t border-secondary-200/50 mt-2">
          <div class="px-3 py-2 text-xs text-secondary-500">
            Conectado como: <span class="font-medium text-secondary-700">{{ userName }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSignOut } from '@nhost/vue';

const router = useRouter();
const route = useRoute();
const { signOut } = useSignOut();
const mobileOpen = ref(false);
const userName = ref(localStorage.getItem('Nombre') || 'Usuario');

const isAdmin = computed(() => {
  // Lógica simple basada en la ruta actual o localStorage
  return route.path.includes('admin') || localStorage.getItem('userRole') === 'administrador';
});

const menuItems = computed(() => {
  const base = [
    { path: '/', label: 'Inicio' },
  ];
  
  if (isAdmin.value) {
    base.push(
      { path: '/administrador', label: 'Dashboard' },
      { path: '/ventas', label: 'Ventas' },
      { path: '/productos', label: 'Productos' },
      { path: '/cliente', label: 'Clientes' },
      { path: '/categorias', label: 'Categorías' },
      { path: '/billetera', label: 'Billeteras' },
    );
  } else {
    base.push(
      { path: '/vendedor', label: 'Mi Panel' },
      { path: '/Nventa', label: 'Nueva Venta' },
      { path: '/ventas', label: 'Historial' },
    );
  }
  return base;
});

const goTo = (path) => {
  mobileOpen.value = false;
  router.push(path);
};

const logout = () => {
  signOut();
  localStorage.removeItem('Nombre');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  router.push('/login');
};
</script>