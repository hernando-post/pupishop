<template>
    <div class="flex-1 bg-white p-4 rounded-lg shadow">
      <!-- Input de código de barras y botón de cámara -->
      <div class="flex gap-4">
        <input 
          v-model="codigoBarras" 
          type="text" 
          placeholder="Escanear código de barras"
          class="flex-1 p-2 border rounded" 
          @keyup.enter="agregarProducto" 
        />
        <button 
          @click="scannerActive ? detenerEscaner() : iniciarEscaner()"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center">
          <span v-if="!scannerActive">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm12 6a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" />
            </svg>
            Abrir Cámara
          </span>
          <span v-else>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Detener Cámara
          </span>
        </button>
      </div>
  
      <!-- Contenedor del scanner -->
      <div v-if="scannerActive" class="mt-4">
        <div id="reader" class="w-full max-w-sm mx-auto"></div>
      </div>
  
      <!-- Lista de productos escaneados -->
      <div class="mt-4 overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-100">
              <th class="p-2 text-left">Código</th>
              <th class="p-2 text-left">Producto</th>
              <th class="p-2 text-right">Stock</th>
              <th class="p-2 text-right">Cantidad</th>
              <th class="p-2 text-right">Precio Unit.</th>
              <th class="p-2 text-right">Subtotal</th>
              <th class="p-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in productosVenta" :key="item.codigo" class="border-b">
              <td class="p-2">{{ item.codigo }}</td>
              <td class="p-2">{{ item.nombre }}</td>
              <td class="p-2 text-right" :class="{ 'text-red-500': item.cantidad > item.stock }">
                {{ item.stock }}
              </td>
              <td class="p-2 text-right">
                <input 
                  v-model.number="item.cantidad" 
                  type="number"
                  class="w-20 p-1 border rounded text-right"
                  :class="{ 'border-red-500': item.cantidad > item.stock }" 
                  min="1"
                  :max="item.stock" 
                  @change="validarCantidad(item)" 
                />
              </td>
              <td class="p-2 text-right">${{ item.precio.toLocaleString() }}</td>
              <td class="p-2 text-right">${{ (item.cantidad * item.precio).toLocaleString() }}</td>
              <td class="p-2 text-center">
                <button @click="eliminarProducto(item)" class="text-red-500 hover:text-red-700">
                  ×
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useQuery } from "@vue/apollo-composable";
  import { gql } from "@apollo/client/core";
  import Swal from 'sweetalert2';
  import { Html5Qrcode } from "html5-qrcode";
  
  // Props
  const props = defineProps({
    productosVenta: {
      type: Array,
      required: true
    }
  });
  
  // Emits
  const emit = defineEmits(['update:productosVenta', 'calcularTotales']);
  
  // Estados reactivos
  const codigoBarras = ref('');
  const scannerActive = ref(false);
  let html5QrcodeScanner = null;
  
  // Consulta de productos
  const {
    loading: productoLoading,
    result: productoResult,
    refetch: productoRefetch
  } = useQuery(gql`
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
  `);
  
  // Función para verificar si hay cámaras disponibles
  const verificarCamara = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      return cameras.length > 0;
    } catch (error) {
      console.error('Error al verificar cámaras:', error);
      return false;
    }
  };
  
  // Función para solicitar permisos de cámara
  const solicitarPermisos = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Liberar la cámara después de obtener permiso
      return true;
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
      return false;
    }
  };
  
  // Función para agregar un producto escaneado
  const agregarProducto = async () => {
    if (!codigoBarras.value) return;
  
    try {
      if (productoLoading.value) {
        return;
      }
  
      if (productoResult.value && productoResult.value.Productos) {
        const producto = productoResult.value.Productos.find(
          p => p.barcode.toString() === codigoBarras.value.toString()
        );
  
        if (!producto) {
          Swal.fire({
            title: 'Producto no encontrado',
            text: 'El código escaneado no corresponde a ningún producto',
            icon: 'warning'
          });
          codigoBarras.value = '';
          return;
        }
  
        // Verificar stock
        if (producto.stock <= 0) {
          Swal.fire({
            title: 'Sin stock',
            text: 'Este producto no tiene stock disponible',
            icon: 'warning'
          });
          codigoBarras.value = '';
          return;
        }
  
        // Buscar si el producto ya existe en la venta
        const productosVenta = [...props.productosVenta];
        const productoExistente = productosVenta.find(
          item => item.barcode === producto.barcode
        );
  
        if (productoExistente) {
          if (productoExistente.cantidad + 1 <= producto.stock) {
            productoExistente.cantidad++;
            emit('update:productosVenta', productosVenta);
            emit('calcularTotales');
            
            Swal.fire({
              title: 'Producto actualizado',
              text: `Se incrementó la cantidad de ${producto.nombre}`,
              icon: 'success',
              timer: 1000,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              title: 'Stock insuficiente',
              text: `Solo hay ${producto.stock} unidades disponibles`,
              icon: 'warning'
            });
          }
        } else {
          const nuevoProducto = {
            barcode: producto.barcode,
            nombre: producto.nombre,
            precio: producto.precio_venta,
            stock: producto.stock,
            cantidad: 1,
            descripcion: producto.descripcion,
            categoria: producto.categoria,
            talla: producto.talla
          };
  
          const nuevosProductos = [...productosVenta, nuevoProducto];
          emit('update:productosVenta', nuevosProductos);
          emit('calcularTotales');
  
          Swal.fire({
            title: 'Producto agregado',
            text: `Se agregó ${producto.nombre}`,
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          });
        }
  
        codigoBarras.value = '';
      } else {
        console.error('No se pudo cargar la lista de productos');
      }
    } catch (error) {
      console.error('Error en agregarProducto:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al buscar el producto',
        icon: 'error'
      });
    }
  };
  
  // Función para eliminar un producto
  const eliminarProducto = (producto) => {
    const productosVenta = [...props.productosVenta];
    const index = productosVenta.findIndex(item => item.barcode === producto.barcode);
    
    if (index !== -1) {
      productosVenta.splice(index, 1);
      emit('update:productosVenta', productosVenta);
      emit('calcularTotales');
      
      Swal.fire({
        title: 'Producto eliminado',
        text: `Se eliminó ${producto.nombre} de la venta`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };
  
  // Función para validar la cantidad de un producto
  const validarCantidad = (item) => {
    if (item.cantidad <= 0) {
      item.cantidad = 1;
    } else if (item.cantidad > item.stock) {
      Swal.fire({
        title: 'Stock insuficiente',
        text: `Solo hay ${item.stock} unidades disponibles`,
        icon: 'warning'
      });
      item.cantidad = item.stock;
    }
    
    // Forzar la actualización del total
    const productosVenta = [...props.productosVenta];
    emit('update:productosVenta', productosVenta);
    emit('calcularTotales');
  };
  
  // Función para iniciar el escáner
  const iniciarEscaner = async () => {
    try {
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta el acceso a la cámara');
      }
  
      // Verificar si hay cámara disponible
      const tieneCamara = await verificarCamara();
      if (!tieneCamara) {
        throw new Error('No se detectó ninguna cámara en el dispositivo');
      }
  
      // Solicitar permisos
      const permisosConcedidos = await solicitarPermisos();
      if (!permisosConcedidos) {
        throw new Error('Permiso denegado para acceder a la cámara');
      }
  
      scannerActive.value = true;
      
      html5QrcodeScanner = new Html5Qrcode("reader");
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [ Html5Qrcode.BARCODE_FORMAT.CODE_128 ],
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true
        }
      };
  
      await html5QrcodeScanner.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
      );
  
    } catch (err) {
      console.error("Error al iniciar el escáner:", err);
      let mensajeError = 'No se pudo acceder a la cámara';
      
      // Personalizar mensaje según el error
      if (err.message.includes('Permission denied')) {
        mensajeError = 'Permiso denegado para acceder a la cámara. Por favor, verifica los permisos en la configuración de tu navegador.';
      } else if (err.message.includes('no se detectó')) {
        mensajeError = 'No se detectó ninguna cámara en el dispositivo.';
      } else if (err.message.includes('no soporta')) {
        mensajeError = 'Tu navegador no soporta el acceso a la cámara. Intenta con otro navegador.';
      }
  
      Swal.fire({
        title: 'Error',
        text: mensajeError,
        icon: 'error',
        confirmButtonText: 'Entendido',
        showCancelButton: true,
        cancelButtonText: 'Abrir configuración',
      }).then((result) => {
        if (!result.isConfirmed) {
          // Intentar abrir la configuración de permisos del navegador
          if (navigator.permissions && navigator.permissions.query) {
            navigator.permissions.query({ name: 'camera' })
              .then(permissionStatus => {
                if (permissionStatus.state === 'denied') {
                  window.open('app-settings:', '_blank');
                }
              });
          }
        }
      });
      
      scannerActive.value = false;
    }
  };
  
  // Función para detener el escáner
  const detenerEscaner = async () => {
    try {
      if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        await html5QrcodeScanner.stop();
        html5QrcodeScanner = null;
      }
    } catch (error) {
      console.error('Error al detener el escáner:', error);
    } finally {
      scannerActive.value = false;
    }
  };
  
  // Función que se ejecuta cuando se escanea un código exitosamente
  const onScanSuccess = async (decodedText, decodedResult) => {
    await detenerEscaner();
    codigoBarras.value = decodedText;
    agregarProducto();
  };
  
  // Función para manejar errores de escaneo
  const onScanError = (error) => {
    // Solo registrar errores críticos, ignorar errores de escaneo normales
    if (error?.message?.includes('NotFoundException')) return;
    console.warn(`Error de escaneo: ${error}`);
  };
  
  // Limpiar el escáner cuando el componente se desmonta
  onUnmounted(() => {
    detenerEscaner();
  });
  
  // Exponer variables y funciones para el template
  defineExpose({
    codigoBarras,
    scannerActive,
    agregarProducto,
    eliminarProducto,
    validarCantidad,
    iniciarEscaner,
    detenerEscaner
  });
  </script>
  
  <style scoped>
  /* Estilos para el contenedor del escáner */
  #reader {
    width: 100% !important;
    height: 300px !important;
    max-width: none !important;
  }
  
  #reader video {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }
  
  /* Ocultar elementos innecesarios del escáner */
  #reader__dashboard_section_swaplink {
    display: none !important;
  }
  
  #reader__status_span {
    display: none !important;
  }
  
  #reader__camera_selection {
    display: none !important;
  }
  </style>