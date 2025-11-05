<template>
    <div class="w-full">
      <!-- Barra de búsqueda -->
      <div class="mb-4 flex gap-4">
        <input 
          v-model="terminoBusqueda" 
          type="text" 
          placeholder="Buscar producto por nombre, código o categoría" 
          class="flex-1 p-2 border rounded"
          @input="buscarProductos"
        />
        <button 
          @click="limpiarBusqueda" 
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          v-if="terminoBusqueda"
        >
          Limpiar
        </button>
      </div>
  
      <!-- Listado de productos -->
      <div v-if="productosEncontrados.length > 0" class="max-h-80 overflow-y-auto border rounded">
        <table class="w-full">
          <thead class="bg-gray-100 sticky top-0">
            <tr>
              <th class="p-2 text-left">Código</th>
              <th class="p-2 text-left">Producto</th>
              <th class="p-2 text-right">Stock</th>
              <th class="p-2 text-right">Precio</th>
              <th class="p-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="producto in productosEncontrados" :key="producto.barcode" class="border-b hover:bg-gray-50">
              <td class="p-2">{{ producto.barcode }}</td>
              <td class="p-2">{{ producto.nombre }} <span v-if="producto.talla" class="text-xs bg-gray-200 px-1 rounded">{{ producto.talla }}</span></td>
              <td class="p-2 text-right" :class="{ 'text-red-500': producto.stock <= 0 }">
                {{ producto.stock }}
              </td>
              <td class="p-2 text-right">${{ producto.precio_venta.toLocaleString() }}</td>
              <td class="p-2 text-center">
                <button 
                  @click="seleccionarProducto(producto)" 
                  class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  :disabled="producto.stock <= 0"
                >
                  Agregar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Mensaje cuando no hay resultados -->
      <div v-else-if="terminoBusqueda && !cargando" class="p-4 text-center text-gray-500 border rounded">
        No se encontraron productos que coincidan con la búsqueda.
      </div>
  
      <!-- Mensaje de carga -->
      <div v-if="cargando" class="p-4 text-center text-gray-500 border rounded">
        Buscando productos...
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, watch, computed } from 'vue';
  import { gql } from "@apollo/client/core";
  import { useQuery } from "@vue/apollo-composable";
  import Swal from 'sweetalert2';
  
  const props = defineProps({
    // Si se desea filtrar por categoría
    categoriaFiltro: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['producto-seleccionado']);
  
  // Estado local
  const terminoBusqueda = ref('');
  const cargando = ref(false);
  const timeoutId = ref(null);
  
  // Consulta GraphQL para obtener todos los productos
  const QUERY_PRODUCTOS = gql`
    query GetProductos {
      Productos {
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
  `;
  
  const { result: productosResult, loading: productosLoading } = useQuery(QUERY_PRODUCTOS);
  
  // Productos filtrados según la búsqueda
  const productosEncontrados = computed(() => {
    if (!productosResult.value || productosLoading.value) return [];
    
    const productos = productosResult.value.Productos || [];
    
    if (!terminoBusqueda.value) return [];
    
    const termino = terminoBusqueda.value.toLowerCase();
    
    return productos.filter(producto => {
      // Filtrar por categoría si está establecida
      if (props.categoriaFiltro && producto.categoria !== props.categoriaFiltro) {
        return false;
      }
      
      return (
        producto.nombre.toLowerCase().includes(termino) ||
        producto.barcode.toString().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(termino)) ||
        (producto.talla && producto.talla.toLowerCase().includes(termino))
      );
    });
  });
  
  // Función para buscar productos con debounce
  const buscarProductos = () => {
    cargando.value = true;
    
    // Cancelar timeout anterior si existe
    if (timeoutId.value) {
      clearTimeout(timeoutId.value);
    }
    
    // Establecer nuevo timeout para evitar muchas búsquedas seguidas
    timeoutId.value = setTimeout(() => {
      cargando.value = false;
    }, 300);
  };
  
  // Función para limpiar la búsqueda
  const limpiarBusqueda = () => {
    terminoBusqueda.value = '';
    cargando.value = false;
  };
  
  // Función para seleccionar un producto
  const seleccionarProducto = (producto) => {
    if (producto.stock <= 0) {
      Swal.fire({
        title: 'Sin stock',
        text: 'Este producto no tiene stock disponible',
        icon: 'warning'
      });
      return;
    }
    
    // Crear un objeto con los datos necesarios para la venta
    const productoParaVenta = {
      barcode: producto.barcode,
      nombre: producto.nombre,
      precio: producto.precio_venta,
      stock: producto.stock,
      cantidad: 1,
      descripcion: producto.descripcion,
      categoria: producto.categoria,
      talla: producto.talla
    };
    
    // Emitir evento con el producto seleccionado
    emit('producto-seleccionado', productoParaVenta);
    
    // Mostrar notificación
    Swal.fire({
      title: 'Producto agregado',
      text: `Se agregó ${producto.nombre}`,
      icon: 'success',
      timer: 1000,
      showConfirmButton: false
    });
  };
  
  // Limpiar timeout al desmontar el componente
  watch(() => productosLoading.value, (newValue) => {
    if (!newValue && terminoBusqueda.value) {
      cargando.value = false;
    }
  });
  </script>