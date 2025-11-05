<template>
    <div class="container mx-auto p-4">
      <!-- Header con Fecha y Hora en tiempo real -->
      <HeaderTiempoReal />
  
      <!-- Búsqueda de Cliente -->
      <BusquedaCliente 
        v-model:identificacion="identificacionCliente" 
        :cliente="clienteActual"
        :cliente-loading="clienteLoading"
        :cliente-result="clienteResult"
        @buscar="buscarCliente"
      />
  
      <!-- Escaneo de Productos y Total Acumulado -->
      <div class="flex gap-4">
        <!-- Sección de productos -->
        <ProductosVenta
          v-model:codigo-barras="codigoBarras"
          v-model:productos="productosVenta"
          :scanner-active="scannerActive"
          @agregar-producto="agregarProducto"
          @eliminar-producto="eliminarProducto"
          @validar-cantidad="validarCantidad"
          @iniciar-escaner="iniciarEscaner"
          @detener-escaner="detenerEscaner"
        />
  
        <!-- Panel lateral con totales -->
        <ResumenVenta
          :subtotal="subtotal"
          :iva="iva"
          :total-venta="totalVenta"
          :hay-errores-stock="hayErroresStock"
          :productos-venta="productosVenta"
          @mostrar-modal-pago="mostrarModalPago"
        />
      </div>
  
      <!-- Modal de Pago -->
      <ModalPago
        v-if="modalPagoVisible"
        :metodos-pago="metodosPago"
        :total-venta="totalVenta"
        :total-pagado="totalPagado"
        @actualizar-pago="actualizarPago"
        @cerrar-modal="cerrarModalPago"
        @procesar-venta="procesarVenta"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { useQuery, useMutation } from "@vue/apollo-composable";
  import { gql } from "@apollo/client/core";
  import Swal from 'sweetalert2';
  import html2pdf from 'html2pdf.js';
  import { Html5Qrcode } from "html5-qrcode";
  
  // Importar componentes
  import HeaderTiempoReal from '@/components/HeaderTiempoReal.vue';
  import BusquedaCliente from '@/components/BusquedaCliente.vue';
  import ProductosVenta from '@/components/ProductosVenta.vue';
  import ResumenVenta from '@/components/ResumenVenta.vue';
  import ModalPago from '@/components/ModalPago.vue';
  import useProductos from '@/composables/useProductos'
  //import BuscarProducto from '@/components/BuscarProducto.vue';
  
  // Estados reactivos
  const identificacionCliente = ref(0);
  const clienteActual = ref(null);
  const codigoBarras = ref('');
  const productosVenta = ref([]);
  const modalPagoVisible = ref(false);
  const scannerActive = ref(false);
  let html5QrcodeScanner = null;
  
  // Queries
  const {
    loading: clienteLoading,
    result: clienteResult,
    refetch: clienteRefetch
  } = useQuery(gql`
    query GetClientes {
      Clientes {
        id_cliente
        nombre
        celular
        correo
        credito
        cedula
        tope
      }
    }
  `);
  
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
  
  // Mutations
  const UPDATE_STOCK = gql`
    mutation UpdateStock($barcode: String!, $newStock: Int!) {
      update_Productos(
        where: { barcode: { _eq: $barcode } },
        _set: { stock: $newStock }
      ) {
        affected_rows
      }
    }
  `;
  
  const CREATE_VENTA = gql`
    mutation CreateVenta(
      $id_cliente: Int!,
      $fecha: timestamptz!,
      $total: Float!,
      $subtotal: Float!,
      $iva: Float!,
      $estado: String!,
      $detalles: [DetalleVentaInput!]!,
      $pagos: [PagoVentaInput!]!
    ) {
      insert_Ventas_one(object: {
        id_cliente: $id_cliente,
        fecha: $fecha,
        total: $total,
        subtotal: $subtotal,
        iva: $iva,
        estado: $estado,
        detalles: $detalles,
        pagos: $pagos
      }) {
        id_venta
        fecha
        total
      }
    }
  `;
  
  const { mutate: updateStock } = useMutation(UPDATE_STOCK);
  const { mutate: createVenta } = useMutation(CREATE_VENTA);
  
  // Métodos de pago
  const metodosPago = ref([
    { id: 1, nombre: 'Efectivo', monto: 0, seleccionado: true },
    { id: 2, nombre: 'Tarjeta', monto: 0, seleccionado: false },
    { id: 3, nombre: 'Crédito', monto: 0, seleccionado: false },
  ]);
  
  // Computed properties
  const subtotal = computed(() => {
    return productosVenta.value.reduce((total, item) => {
      return total + (item.cantidad * item.precio);
    }, 0);
  });
  
  const iva = computed(() => {
    return subtotal.value * 0.19;
  });
  
  const totalVenta = computed(() => {
    return subtotal.value + iva.value;
  });
  
  const totalPagado = computed(() => {
    return metodosPago.value.reduce((total, metodo) => {
      return total + (metodo.seleccionado ? metodo.monto : 0);
    }, 0);
  });
  
  const hayErroresStock = computed(() => {
    return productosVenta.value.some(item => item.cantidad > item.stock);
  });
  
  // Función para buscar un cliente por cédula
  const buscarCliente = () => {
    const cedula = identificacionCliente.value.trim();
  
    if (clienteResult.value && clienteResult.value.Clientes) {
      const cliente = clienteResult.value.Clientes.find(cliente => cliente.cedula == cedula);
  
      if (cliente) {
        clienteActual.value = { ...cliente };
      } else {
        const confirmarCreacion = confirm('Cliente no encontrado. ¿Desea crearlo?');
        if (confirmarCreacion) {
          // Aquí iría la lógica para crear el cliente
        }
      }
    } else {
      console.error('No se pudo cargar la lista de clientes');
    }
  };
  
 /*  const BuscarProducto = () => {
    const cedula = identificacionCliente.value.trim();
  
    if (clienteResult.value && clienteResult.value.Clientes) {
      const cliente = clienteResult.value.Clientes.find(cliente => cliente.cedula == cedula);
  
      if (cliente) {
        clienteActual.value = { ...cliente };
      } else {
        const confirmarCreacion = confirm('Cliente no encontrado. ¿Desea crearlo?');
        if (confirmarCreacion) {
          // Aquí iría la lógica para crear el cliente
        }
      }
    } else {
      console.error('No se pudo cargar la lista de clientes');
    }
  }; */
  
  // Función para escanear y agregar un producto
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
        const productoExistente = productosVenta.value.find(
          item => item.barcode === producto.barcode
        );
  
        if (productoExistente) {
          if (productoExistente.cantidad + 1 <= producto.stock) {
            productoExistente.cantidad++;
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
  
          productosVenta.value.push(nuevoProducto);
  
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
        text: 'Error al buscar el producto hoy',
        icon: 'error'
      });
    }
  };
  
  const eliminarProducto = (producto) => {
    const index = productosVenta.value.findIndex(item => item.barcode === producto.barcode);
    if (index !== -1) {
      productosVenta.value.splice(index, 1);
      Swal.fire({
        title: 'Producto eliminado',
        text: `Se eliminó ${producto.nombre} de la venta`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };
  
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
    const temp = [...productosVenta.value];
    productosVenta.value = temp;
  };
  
  const mostrarModalPago = () => {
    modalPagoVisible.value = true;
    // Inicializar el pago en efectivo con el total
    metodosPago.value[0].monto = totalVenta.value;
    metodosPago.value[0].seleccionado = true;
    // Resetear otros métodos de pago
    metodosPago.value.slice(1).forEach(metodo => {
      metodo.monto = 0;
      metodo.seleccionado = false;
    });
  };
  
  const cerrarModalPago = () => {
    modalPagoVisible.value = false;
  };
  
  const actualizarPago = () => {
    const metodoPagoActual = metodosPago.value.find(m => m.monto > 0);
    if (!metodoPagoActual) return;
  
    // Calcular el total pagado excluyendo el método actual
    const otrosPagos = metodosPago.value
      .filter(m => m.id !== metodoPagoActual.id && m.seleccionado)
      .reduce((sum, m) => sum + m.monto, 0);
  
    // Si es crédito, verificar el límite
    if (metodoPagoActual.nombre === 'Crédito' && metodoPagoActual.seleccionado) {
      const creditoDisponible = clienteActual.value?.tope - clienteActual.value?.credito;
      if (metodoPagoActual.monto > creditoDisponible) {
        Swal.fire({
          title: 'Límite de crédito excedido',
          text: `El crédito disponible es $${creditoDisponible.toLocaleString()}`,
          icon: 'warning'
        });
        metodoPagoActual.monto = 0;
        metodoPagoActual.seleccionado = false;
        return;
      }
    }
  
    // Actualizar el monto en efectivo
    const montoFaltante = totalVenta.value - otrosPagos - metodoPagoActual.monto;
    const efectivo = metodosPago.value[0];
    efectivo.monto = Math.max(0, montoFaltante);
    efectivo.seleccionado = efectivo.monto > 0;
  };
  
  const procesarVenta = async () => {
    if (!clienteActual.value) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar un cliente para procesar la venta',
        icon: 'warning'
      });
      return;
    }
  
    try {
      // Preparar los datos de la venta
      const ventaInput = {
        id_cliente: parseInt(clienteActual.value.id_cliente),
        fecha: new Date().toISOString(),
        subtotal: parseFloat(subtotal.value),
        iva: parseFloat(iva.value),
        total: parseFloat(totalVenta.value),
        estado: 'COMPLETADA',
        detalles: productosVenta.value.map(p => ({
          barcode: p.barcode,
          cantidad: parseInt(p.cantidad),
          precio_unitario: parseFloat(p.precio),
          subtotal: parseFloat(p.cantidad * p.precio)
        })),
        pagos: metodosPago.value
          .filter(m => m.seleccionado && m.monto > 0)
          .map(m => ({
            tipo: m.nombre,
            monto: parseFloat(m.monto)
          }))
      };
  
      // Crear la venta
      const { data: ventaResult } = await createVenta({
        variables: ventaInput
      });
  
      // Actualizar stock de productos
      for (const producto of productosVenta.value) {
        try {
          await updateStock({
            variables: {
              barcode: producto.barcode,
              newStock: producto.stock - producto.cantidad
            }
          });
        } catch (error) {
          console.error('Error al actualizar stock:', error);
          throw new Error('Error al actualizar el stock de productos');
        }
      }
  
      // Actualizar crédito del cliente si se usó
      const pagoCreditoUsado = metodosPago.value.find(m => m.nombre === 'Crédito' && m.seleccionado);
      if (pagoCreditoUsado && pagoCreditoUsado.monto > 0) {
        const nuevoCredito = clienteActual.value.credito + pagoCreditoUsado.monto;
        // Aquí iría la mutación para actualizar el crédito
      }
  
      // Mostrar confirmación y opción de imprimir
      const { isConfirmed } = await Swal.fire({
        title: 'Venta exitosa',
        text: '¿Desea imprimir el comprobante?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sí, imprimir',
        cancelButtonText: 'No, gracias'
      });
  
      if (isConfirmed) {
        const comprobanteHtml = generarHtmlComprobante(ventaInput);
        const element = document.createElement('div');
        element.innerHTML = comprobanteHtml;
        await html2pdf().from(element).save(`comprobante_venta_${Date.now()}.pdf`);
      }
  
      // Limpiar formulario
      limpiarFormulario();
    } catch (error) {
      console.error('Error detallado:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al procesar la venta: ' + (error.message || 'Error desconocido'),
        icon: 'error'
      });
    }
  };
  
  const limpiarFormulario = () => {
    clienteActual.value = null;
    productosVenta.value = [];
    identificacionCliente.value = 0;
    codigoBarras.value = '';
    modalPagoVisible.value = false;
    metodosPago.value.forEach(metodo => {
      metodo.monto = 0;
      metodo.seleccionado = false;
    });
  };
  
  const generarHtmlComprobante = (ventaData) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">PUPISHOP</h1>
          <p>NIT: XXX.XXX.XXX-X</p>
          <p>Dirección: xxxxxxxxx</p>
          <p>Teléfono: XXX-XXX-XXXX</p>
          <hr>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3>Factura de Venta No. ${ventaData.id_venta}</h3>
          <p>Fecha: ${new Date(ventaData.fecha).toLocaleString()}</p>
          <p>Cliente: ${clienteActual.value.nombre}</p>
          <p>Identificación: ${clienteActual.value.cedula}</p>
        </div>
  
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 8px; border: 1px solid #dee2e6;">Producto</th>
              <th style="padding: 8px; border: 1px solid #dee2e6;">Cant.</th>
              <th style="padding: 8px; border: 1px solid #dee2e6;">Precio Unit.</th>
              <th style="padding: 8px; border: 1px solid #dee2e6;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${ventaData.detalles.map(detalle => `
              <tr>
                <td style="padding: 8px; border: 1px solid #dee2e6;">${detalle.nombre}</td>
                <td style="padding: 8px; border: 1px solid #dee2e6; text-align: center;">${detalle.cantidad}</td>
                <td style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">$${detalle.precio_unitario.toLocaleString()}</td>
                <td style="padding: 8px; border: 1px solid #dee2e6; text-align: right;">$${detalle.subtotal.toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
  
        <div style="margin-bottom: 20px;">
          <p style="text-align: right;"><strong>Subtotal:</strong> $${ventaData.subtotal.toLocaleString()}</p>
          <p style="text-align: right;"><strong>IVA (19%):</strong> $${ventaData.iva.toLocaleString()}</p>
          <p style="text-align: right;"><strong>Total:</strong> $${ventaData.total.toLocaleString()}</p>
        </div>
  
        <div style="margin-top: 20px;">
          <h4>Formas de Pago</h4>
          ${ventaData.pagos.map(pago => `
            <p>${pago.tipo}: $${pago.monto.toLocaleString()}</p>
          `).join('')}
        </div>
  
        <div style="margin-top: 40px; text-align: center;">
          <p>¡Gracias por su compra!</p>
          <p>www.pupishop.com</p>
        </div>
      </div>
    `;
  };
  
  // Funciones para el escáner de código de barras
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
  
  const iniciarEscaner = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta el acceso a la cámara');
      }
  
      const tieneCamara = await verificarCamara();
      if (!tieneCamara) {
        throw new Error('No se detectó ninguna cámara en el dispositivo');
      }
  
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
  
  const onScanSuccess = async (decodedText, decodedResult) => {
    await detenerEscaner();
    codigoBarras.value = decodedText;
    agregarProducto();
  };
  
  const onScanError = (error) => {
    // Solo registrar errores críticos, ignorar errores de escaneo normales
    if (error?.message?.includes('NotFoundException')) return;
    console.warn(`Error de escaneo: ${error}`);
  };
  
  // Limpiar el escáner cuando el componente se desmonta
  onUnmounted(() => {
    detenerEscaner();
    if (intervalReloj) clearInterval(intervalReloj);
  });
  </script>
  
  <style scoped>
  /* Este componente no necesita estilos específicos ya que importa los componentes
     que tienen sus propios estilos */
  </style>