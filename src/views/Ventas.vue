<template>
    <div class="container mx-auto p-4">
        <!-- Header con Fecha y Hora en tiempo real -->
        <div class="mb-4 bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <h1 class="text-2xl font-bold">Nueva Venta</h1>
            <div class="text-right">
                <div class="text-lg">{{ fechaActual }}</div>
                <div class="text-2xl font-bold">{{ horaActual }}</div>
            </div>
        </div>

        <!-- Búsqueda de Cliente -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow">
            <div class="flex gap-4">
                <input v-model="identificacionCliente" type="text" placeholder="Identificación del cliente"
                    class="flex-1 p-2 border rounded" @keyup.enter="buscarCliente" />
                <button @click="buscarCliente" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Buscar Cliente
                </button>
            </div>
            <div v-if="clienteActual">
                <h3>Detalles del Cliente</h3>
                <p>Nombre: {{ clienteActual.nombre }}</p>
                <p>Celular: {{ clienteActual.celular }}</p>
                <p>Correo: {{ clienteActual.correo }}</p>
                <p>Crédito: {{ clienteActual.credito }}</p>
                <p>Cédula: {{ clienteActual.cedula }}</p>
                <p>Tope: {{ clienteActual.tope }}</p>
            </div>
            <div v-else-if="clienteLoading">
                <p>Cargando datos del cliente...</p>
            </div>
            <div v-else-if="clienteResult && clienteResult.Clientes.length === 0">
                <p>No se encontró ningún cliente.</p>
            </div>
        </div>

        <!-- Escaneo de Productos y Total Acumulado -->
        <div class="flex gap-4">
            <!-- Sección de productos -->
            <div class="flex-1 bg-white p-4 rounded-lg shadow">
                <div class="flex gap-4">
                    <input v-model="codigoBarras" type="text" placeholder="Escanear código de barras"
                        class="flex-1 p-2 border rounded" @keyup.enter="agregarProducto" />
                    <button @click="scannerActive ? detenerEscaner() : iniciarEscaner()"
                        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center">
                        <span v-if="!scannerActive">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4 5a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm12 6a1 1 0 11-2 0 1 1 0 012 0z"
                                    clip-rule="evenodd" />
                            </svg>
                            Abrir Cámara
                        </span>
                        <span v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
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
                                    <input v-model.number="item.cantidad" type="number"
                                        class="w-20 p-1 border rounded text-right"
                                        :class="{ 'border-red-500': item.cantidad > item.stock }" min="1"
                                        :max="item.stock" @change="validarCantidad(item)" />
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

            <!-- Panel lateral con totales -->
            <div class="w-80 bg-white p-4 rounded-lg shadow">
                <h3 class="text-xl font-bold mb-4">Resumen de Venta</h3>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${{ subtotal.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>IVA (19%):</span>
                        <span>${{ iva.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between text-xl font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>${{ totalVenta.toLocaleString() }}</span>
                    </div>
                </div>

                <button @click="mostrarModalPago" :disabled="!productosVenta.length || hayErroresStock"
                    class="w-full mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50">
                    Proceder al Pago
                </button>
            </div>
        </div>
        <ModalPagos :visible="modalPagoVisible" :totalVenta="totalVenta" :clienteActual="clienteActual"
            @cerrar="cerrarModalPago" @procesar="procesarVenta" @updateMetodosPago="actualizarMetodosPagoExterno" />


    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSignOut, useUserId } from '@nhost/vue'
import { useQuery, useMutation } from "@vue/apollo-composable";
import { gql } from "@apollo/client/core";
import Swal from 'sweetalert2';
import html2pdf from 'html2pdf.js';
import { Html5Qrcode } from "html5-qrcode";
import ModalPagos from '@/components/ModalPago.vue';
const fechaActual = ref('')
const horaActual = ref('')
let intervalReloj = null
const scannerActive = ref(false)
let html5QrcodeScanner = null
const verificarCamara = async () => {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        return cameras.length > 0;
    } catch (error) {
        console.error('Error al verificar cámaras:', error);
        return false;
    }
}
const solicitarPermisos = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Liberar la cámara después de obtener permiso
        return true;
    } catch (error) {
        console.error('Error al solicitar permisos:', error);
        return false;
    }
}

const router = useRouter()

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
  `)

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
  `)
const actualizarReloj = () => {
    const ahora = new Date()
    fechaActual.value = ahora.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    horaActual.value = ahora.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
}

onMounted(() => {
    actualizarReloj()
    intervalReloj = setInterval(actualizarReloj, 1000)
})

onUnmounted(() => {
    if (intervalReloj) clearInterval(intervalReloj)
})



// Estados reactivos
const identificacionCliente = ref(0)
const clienteActual = ref(null)
const codigoBarras = ref('')
const productosVenta = ref([])
const modalPagoVisible = ref(false)
const nuevoClienteForm = ref({
    nombre: '',
    celular: '',
    correo: '',
    cedula: 0,
    tope: 0,
    credito: 0
})



onMounted(() => {
    actualizarReloj()
    intervalReloj = setInterval(actualizarReloj, 1000)
})

onUnmounted(() => {
    if (intervalReloj) clearInterval(intervalReloj)
})

const metodosPago = ref([
    { id: 1, nombre: 'Efectivo', monto: 0, seleccionado: true },
    { id: 2, nombre: 'Tarjeta', monto: 0, seleccionado: false },
    { id: 3, nombre: 'Crédito', monto: 0, seleccionado: false },
])

// Computed properties
const subtotal = computed(() => {
    return productosVenta.value.reduce((total, item) => {
        return total + (item.cantidad * item.precio)
    }, 0)
})

const iva = computed(() => {
    return subtotal.value * 0.19
})

const totalVenta = computed(() => {
    return subtotal.value + iva.value
})

const totalPagado = computed(() => {
    return metodosPago.value.reduce((total, metodo) => {
        return total + (metodo.seleccionado ? metodo.monto : 0)
    }, 0)
})

const hayErroresStock = computed(() => {
    return productosVenta.value.some(item => item.cantidad > item.stock)
})

// Función para buscar un cliente por cédula
const buscarCliente = () => {
    const cedula = identificacionCliente.value.trim();
    console.log('Buscando cliente con cédula:', cedula);

    if (!cedula) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor ingrese una cédula',
            icon: 'warning'
        });
        return;
    }

    if (clienteResult.value && clienteResult.value.Clientes) {
        console.log('Datos de clientes disponibles:', clienteResult.value.Clientes);

        // Convertir a número para la búsqueda (ya que en la BD está como Int)
        const cedulaNumero = parseInt(cedula);
        const cliente = clienteResult.value.Clientes.find(cliente =>
            cliente.cedula === cedulaNumero
        );

        console.log('Cliente encontrado:', cliente);

        if (cliente) {
            clienteActual.value = {
                ...cliente,
                id_cliente: parseInt(cliente.id_cliente)
            };
            console.log('Cliente actual asignado:', clienteActual.value);

            Swal.fire({
                title: 'Cliente encontrado',
                text: `Cliente: ${cliente.nombre}`,
                icon: 'success',
                timer: 1500
            });
        } else {
            Swal.fire({
                title: 'Cliente no encontrado',
                text: '¿Desea crear un nuevo cliente con esta cédula?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    mostrarFormularioNuevoCliente();
                }
            });
        }
    } else {
        console.error('No se pudo cargar la lista de clientes');
    }
};
// Observa cambios en clienteResult para asegurar que los datos se han cargado
watch(clienteResult, (newValue) => {
    if (newValue && newValue.Clientes) {

    } else {
        console.error('Error al cargar los datos de clientes');
    }
});

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
// Mutation para crear la venta
// Versión alternativa si la anterior falla
// VERSION SIMPLE - sin relaciones (para probar primero)
const CREATE_VENTA_SIMPLE = gql`
  mutation CreateVentaSimple(
    $id_cliente: Int!,
    $fecha: timestamptz!,
    $total: numeric!,
    $subtotal: numeric!,
    $iva: numeric!,
    $estado: String!
  ) {
    insert_ventas_one(object: {
      id_cliente: $id_cliente,
      fecha: $fecha,
      total: $total,
      subtotal: $subtotal,
      iva: $iva,
      estado: $estado
    }) {
      id_venta
      fecha
      total
    }
  }
`;

// VERSION COMPLETA - con relaciones
const CREATE_VENTA_COMPLETA = gql`
  mutation CreateVentaCompleta(
    $id_cliente: Int!,
    $fecha: timestamptz!,
    $total: numeric!,
    $subtotal: numeric!,
    $iva: numeric!,
    $estado: String!,
    $detalles: [detalle_venta_insert_input!]!,
    $pagos: [pago_venta_insert_input!]!
  ) {
    insert_ventas_one(object: {
      id_cliente: $id_cliente,
      fecha: $fecha,
      total: $total,
      subtotal: $subtotal,
      iva: $iva,
      estado: $estado,
      detalle_venta: { data: $detalles },
      pago_venta: { data: $pagos }
    }) {
      id_venta
      fecha
      total
    }
  }
`;

// Define AMBAS mutations
const { mutate: createVentaSimple } = useMutation(CREATE_VENTA_SIMPLE);
const { mutate: createVentaCompleta } = useMutation(CREATE_VENTA_COMPLETA);
const { mutate: updateStock } = useMutation(UPDATE_STOCK)
//const { mutate: createVenta } = useMutation(CREATE_VENTA)

const mostrarModalPago = () => {
    modalPagoVisible.value = true;
    // El modal se encarga de inicializar todo
}

const cerrarModalPago = () => {
    modalPagoVisible.value = false;
}
const actualizarMetodosPagoExterno = (nuevosMetodos) => {
    metodosPago.value = nuevosMetodos;
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
}
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
}
// Mutation para actualizar el crédito del cliente
const UPDATE_CREDITO_CLIENTE = gql`
  mutation UpdateCreditoCliente($id_cliente: Int!, $nuevoCredito: Float!) {
    update_Clientes_by_pk(
      pk_columns: {id_cliente: $id_cliente},
      _set: {credito: $nuevoCredito}
    ) {
      id_cliente
      credito
    }
  }
`;

// Mutation para crear movimiento de caja
const CREATE_MOVIMIENTO_CAJA = gql`
  mutation CreateMovimientoCaja(
    $tipo: String!,
    $monto: numeric!,
    $metodo: String!,
    $descripcion: String!,
    $id_venta: Int
  ) {
    insert_movimientoscaja(objects: {
      tipo: $tipo,
      monto: $monto,
      metodo: $metodo,
      descripcion: $descripcion,
      id_venta: $id_venta
    }) {
      affected_rows
      returning {
        id_movimiento
        fecha
        tipo
        monto
        metodo
        descripcion
        id_venta
        created_at
      }
    }
  }
`;

const { mutate: updateCreditoCliente } = useMutation(UPDATE_CREDITO_CLIENTE);
const { mutate: createMovimientoCaja } = useMutation(CREATE_MOVIMIENTO_CAJA);

const mostrarFormularioNuevoCliente = async () => {
    const { value: formValues } = await Swal.fire({
        title: 'Crear nuevo cliente',
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre completo *" required>
            <input id="celular" class="swal2-input" placeholder="Celular">
            <input id="correo" class="swal2-input" placeholder="Correo electrónico" type="email">
            <input id="tope" class="swal2-input" type="number" placeholder="Límite de crédito" value="100000">
            <p class="text-sm text-gray-500 mt-2">Cédula: ${identificacionCliente.value}</p>
            <p class="text-xs text-gray-400">* Campos obligatorios</p>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear Cliente',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nombre = document.getElementById('nombre').value;
            const celular = document.getElementById('celular').value;
            const correo = document.getElementById('correo').value;
            const tope = document.getElementById('tope').value;

            if (!nombre) {
                Swal.showValidationMessage('El nombre es obligatorio');
                return false;
            }

            return {
                nombre: nombre,
                celular: celular,
                correo: correo,
                cedula: identificacionCliente.value,
                tope: parseFloat(tope) || 100000,
                credito: 0
            }
        }
    });

    if (formValues) {
        const clienteCreado = await crearNuevoCliente(formValues);
        if (clienteCreado) {
            console.log('Cliente creado y listo para usar:', clienteActual.value);
        }
    }
}
// Funcion para crear nuevo cliente
// Primero, define la mutation igual que en CrearCliente.vue
const CREATE_CLIENTE = gql`
  mutation InsertCliente(
    $nombre: String, 
    $correo: String, 
    $cedula: Int!, 
    $celular: String, 
    $credito: Int!, 
    $tope: Int!
  ) {
    insert_Clientes(
      objects: {
        nombre: $nombre, 
        correo: $correo, 
        cedula: $cedula, 
        credito: $credito, 
        celular: $celular, 
        tope: $tope
      }
    ) {
      affected_rows
      returning {
        id_cliente
        nombre
        correo
        celular
        credito
        cedula
        tope
      }
    }
  }
`;

// Define la mutation
const { mutate: createCliente } = useMutation(CREATE_CLIENTE);
const { mutate: crearClienteMutation } = useMutation(CREATE_CLIENTE);

// Función corregida para crear cliente
const crearNuevoCliente = async (clienteData) => {
    try {
        console.log('Datos del cliente a crear:', clienteData);

        // Validar campos obligatorios
        if (!clienteData.nombre || !clienteData.cedula) {
            Swal.fire({
                title: 'Error',
                text: 'Nombre y cédula son campos obligatorios',
                icon: 'warning'
            });
            return null;
        }

        // Preparar los datos exactamente como en CrearCliente.vue
        const variables = {
            nombre: clienteData.nombre || '',
            correo: clienteData.correo || '',
            cedula: parseInt(clienteData.cedula) || 0,
            celular: clienteData.celular || '',
            credito: parseInt(clienteData.credito) || 0,
            tope: parseInt(clienteData.tope) || 0
        };

        console.log('Variables para mutation:', variables);

        // Ejecutar la mutation
        const result = await createCliente(variables);

        if (result.errors) {
            console.error('Errores de GraphQL:', result.errors);
            throw new Error(result.errors[0].message);
        }

        if (result.data && result.data.insert_Clientes.returning.length > 0) {
            const clienteCreado = result.data.insert_Clientes.returning[0];
            console.log('Cliente creado exitosamente:', clienteCreado);

            // Asignar el cliente creado
            clienteActual.value = {
                ...clienteCreado,
                id_cliente: parseInt(clienteCreado.id_cliente)
            };

            Swal.fire({
                title: '¡Éxito!',
                text: 'Cliente creado correctamente',
                icon: 'success',
                timer: 2000
            });

            return clienteCreado;
        } else {
            throw new Error('No se pudo crear el cliente');
        }

    } catch (error) {
        console.error('Error al crear cliente:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudo crear el cliente: ' + error.message,
            icon: 'error'
        });
        return null;
    }
}


const agregarProducto = async () => {
    if (!codigoBarras.value) return;

    try {
        if (productoLoading.value) {
            return;
        }

        if (productoResult.value && productoResult.value.Productos) {
            // Debug para ver los datos
            //console.log('Productos disponibles:', productoResult.value.Productos);
            //console.log('Buscando código de barras:', codigoBarras.value);

            const producto = productoResult.value.Productos.find(
                p => p.barcode.toString() === codigoBarras.value.toString()
            );

            //console.log('Producto encontrado:', producto);

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
            text: 'Error al buscar el producto',
            icon: 'error'
        });
    }
}

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
}


//verificar carga de productos en la venta
const limpiarFormulario = () => {
    clienteActual.value = null
    productosVenta.value = []
    identificacionCliente.value = 0
    codigoBarras.value = ''
    modalPagoVisible.value = false
    metodosPago.value.forEach(metodo => {
        metodo.monto = 0
        metodo.seleccionado = false
    })
}
// Función mejorada para procesar venta
async function procesarVenta() {
    console.log('=== PROCESAR VENTA LLAMADO ===');

    if (!clienteActual.value) {
        Swal.fire('Error', 'No hay cliente seleccionado', 'warning');
        return;
    }

    const idCliente = parseInt(clienteActual.value.id_cliente);
    console.log('ID Cliente a usar:', idCliente);

    try {
        // PRIMERO: Probar con versión SIMPLE (sin relaciones)
        console.log('=== PROBANDO VENTA SIMPLE ===');

        const ventaSimpleInput = {
            id_cliente: idCliente,
            fecha: new Date().toISOString(),
            subtotal: parseFloat(subtotal.value),
            iva: parseFloat(iva.value),
            total: parseFloat(totalVenta.value),
            estado: 'COMPLETADA'
        };

        console.log('Venta simple a enviar:', ventaSimpleInput);

        const { data: ventaSimpleResult, errors: simpleErrors } = await createVentaSimple(ventaSimpleInput);

        if (simpleErrors) {
            console.error('Errores en venta simple:', simpleErrors);
            throw new Error('Venta simple falló: ' + simpleErrors[0].message);
        }

        console.log('✅ Venta SIMPLE creada exitosamente:', ventaSimpleResult);

        const idVenta = ventaSimpleResult.insert_ventas_one.id_venta;
        console.log('ID Venta creada:', idVenta);

        // SI LA VENTA SIMPLE FUNCIONA, continuar con el resto
        console.log('Actualizando stock...');
        for (const producto of productosVenta.value) {
            console.log('Actualizando producto:', {
                barcode: producto.barcode,
                stockActual: producto.stock,
                cantidad: producto.cantidad,
                nuevoStock: producto.stock - producto.cantidad
            });

            await updateStock({
                barcode: producto.barcode,
                newStock: producto.stock - producto.cantidad
            });
        }
        console.log('✅ Stock actualizado');

        // Procesar crédito si aplica
        const pagoCredito = metodosPago.value.find(m => m.nombre === 'Crédito' && m.seleccionado && m.monto > 0);
        if (pagoCredito) {
            console.log('Procesando crédito...');
            const nuevoCredito = parseFloat(clienteActual.value.credito) + parseFloat(pagoCredito.monto);
            await updateCreditoCliente({
                id_cliente: idCliente,
                nuevoCredito: nuevoCredito
            });
            console.log('✅ Crédito actualizado');
        }

        // Registrar movimientos de caja
        console.log('Registrando movimientos de caja...');
        const pagosCaja = metodosPago.value.filter(m =>
            m.seleccionado && m.monto > 0 && m.nombre !== 'Crédito'
        );

        for (const pago of pagosCaja) {
            await createMovimientoCaja({
                tipo: 'INGRESO',
                monto: parseFloat(pago.monto),
                metodo: pago.nombre,
                descripcion: `Venta #${idVenta} - ${pago.nombre}`,
                id_venta: idVenta
            });
        }
        console.log('✅ Movimientos de caja registrados');

        // Mostrar resumen
        await mostrarResumenVenta(ventaSimpleResult.insert_ventas_one);

    } catch (error) {
        console.error('Error en procesarVenta:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error al procesar la venta: ' + error.message,
            icon: 'error'
        });
    }
}

// Función para procesar crédito
const procesarCreditoSiAplica = async (idCliente) => {
    const pagoCredito = metodosPago.value.find(m => m.nombre === 'Crédito' && m.seleccionado && m.monto > 0);
    if (pagoCredito) {
        console.log('Procesando crédito...');
        const nuevoCredito = parseFloat(clienteActual.value.credito) + parseFloat(pagoCredito.monto);
        const { errors: creditoErrors } = await updateCreditoCliente({
            variables: {
                id_cliente: idCliente,
                nuevoCredito: nuevoCredito
            }
        });

        if (creditoErrors) {
            console.error('Error al actualizar crédito:', creditoErrors);
            throw new Error('Error al actualizar el crédito del cliente');
        }
        console.log('✅ Crédito actualizado correctamente');
    }
};

// Función para registrar movimientos de caja
const registrarMovimientosCaja = async (idVenta) => {
    console.log('Registrando movimientos de caja...');
    const pagosCaja = metodosPago.value.filter(m =>
        m.seleccionado && m.monto > 0 && m.nombre !== 'Crédito'
    );

    for (const pago of pagosCaja) {
        await createMovimientoCaja({
            tipo: 'INGRESO',
            monto: parseFloat(pago.monto),
            metodo: pago.nombre,
            descripcion: `Venta #${idVenta} - ${pago.nombre}`,
            id_venta: idVenta
        });

        if (cajaErrors) {
            console.error('Error al crear movimiento de caja:', cajaErrors);
            // No lanzamos error aquí para no revertir la venta completa
        }
    }
    console.log('✅ Movimientos de caja registrados');
};

// Función para mostrar resumen de la venta
async function mostrarResumenVenta(venta) {
    let mensaje = `
        <div class="text-left">
            <h3 class="font-bold text-lg">Venta #${venta.id_venta} Completada</h3>
            <p><strong>Total:</strong> $${totalVenta.value.toLocaleString()}</p>
            <p><strong>Cliente:</strong> ${clienteActual.value.nombre}</p>
            <p><strong>Métodos de pago:</strong></p>
            <ul class="list-disc list-inside">
    `;

    metodosPago.value
        .filter(m => m.seleccionado && m.monto > 0)
        .forEach(m => {
            mensaje += `<li>${m.nombre}: $${m.monto.toLocaleString()}</li>`;
        });

    mensaje += `</ul>`;

    // Si se usó crédito, mostrar nuevo saldo
    const pagoCredito = metodosPago.value.find(m => m.nombre === 'Crédito' && m.seleccionado && m.monto > 0);
    if (pagoCredito) {
        const nuevoCredito = clienteActual.value.credito + pagoCredito.monto;
        mensaje += `<p class="mt-2"><strong>Nuevo saldo de crédito:</strong> $${nuevoCredito.toLocaleString()}</p>`;
    }

    mensaje += `</div>`;

    const { value: opcion } = await Swal.fire({
        title: 'Venta Exitosa!',
        html: mensaje,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Imprimir Comprobante',
        cancelButtonText: 'Nueva Venta',
        showDenyButton: true,
        denyButtonText: 'Ver Detalles'
    });

    if (opcion) {
        // Imprimir comprobante
        const comprobanteHtml = generarHtmlComprobante({
            ...venta,
            detalles: productosVenta.value,
            pagos: metodosPago.value.filter(m => m.seleccionado && m.monto > 0)
        });
        const element = document.createElement('div');
        element.innerHTML = comprobanteHtml;
        await html2pdf().from(element).save(`comprobante_venta_${venta.id_venta}.pdf`);
    }

    // Limpiar formulario
    limpiarFormulario();
}

// Función para validar crédito antes de procesar
function validarCreditoDisponible() {
    const pagoCredito = metodosPago.value.find(m => m.nombre === 'Crédito' && m.seleccionado);
    if (pagoCredito && pagoCredito.monto > 0 && clienteActual.value) {
        const creditoDisponible = clienteActual.value.tope - clienteActual.value.credito;
        if (pagoCredito.monto > creditoDisponible) {
            Swal.fire({
                title: 'Crédito Insuficiente',
                text: `El cliente tiene $${creditoDisponible.toLocaleString()} disponible. Monto solicitado: $${pagoCredito.monto.toLocaleString()}`,
                icon: 'warning'
            });
            return false;
        }
    }
    return true;
}

// Actualizar la función completarVenta para incluir validación
const completarVenta = () => {
    if (!validarCreditoDisponible()) {
        return;
    }
    procesarVenta();
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
}
// Función para probar el flujo completo paso a paso
const probarFlujoCompleto = async () => {
    try {
        console.log('=== PROBANDO FLUJO COMPLETO PASO A PASO ===');

        if (!clienteActual.value) {
            Swal.fire('Error', 'Selecciona un cliente primero', 'warning');
            return;
        }

        const idCliente = parseInt(clienteActual.value.id_cliente);

        // 1. Crear venta
        console.log('1. Creando venta...');
        const ventaResult = await createVentaSimple({
            id_cliente: idCliente,
            fecha: new Date().toISOString(),
            subtotal: parseFloat(subtotal.value),
            iva: parseFloat(iva.value),
            total: parseFloat(totalVenta.value),
            estado: 'COMPLETADA'
        });

        const idVenta = ventaResult.data.insert_ventas_one.id_venta;
        console.log('✅ Venta creada ID:', idVenta);

        // 2. Actualizar stock
        console.log('2. Actualizando stock...');
        for (const producto of productosVenta.value) {
            await updateStock({
                barcode: producto.barcode,
                newStock: producto.stock - producto.cantidad
            });
        }
        console.log('✅ Stock actualizado');

        // 3. Mostrar éxito
        Swal.fire('¡Éxito!', `Venta #${idVenta} procesada correctamente`, 'success');

        // 4. Limpiar formulario
        limpiarFormulario();

    } catch (error) {
        console.error('Error en flujo completo:', error);
        Swal.fire('Error', error.message, 'error');
    }
}
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
            formatsToSupport: [Html5Qrcode.BARCODE_FORMAT.CODE_128],
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
}
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
}

// Función que se ejecuta cuando se escanea un código exitosamente
const onScanSuccess = async (decodedText, decodedResult) => {
    await detenerEscaner();
    codigoBarras.value = decodedText;
    agregarProducto();
}


// Función para manejar errores de escaneo
const onScanError = (error) => {
    // Solo registrar errores críticos, ignorar errores de escaneo normales
    if (error?.message?.includes('NotFoundException')) return;
    console.warn(`Error de escaneo: ${error}`);
}

// Limpiar el escáner cuando el componente se desmonta
onUnmounted(() => {
    detenerEscaner();
})
// Exponer variables y funciones para el template
defineExpose({
    identificacionCliente,
    clienteActual,
    codigoBarras,
    productosVenta,
    modalPagoVisible,
    metodosPago,
    subtotal,
    iva,
    totalVenta,
    totalPagado,
    hayErroresStock,
    buscarCliente,
    agregarProducto,
    eliminarProducto,
    validarCantidad,
    actualizarPago,
    procesarVenta,
    limpiarFormulario,
    mostrarModalPago,
    cerrarModalPago,
    fechaActual,
    horaActual,
    scannerActive,
    iniciarEscaner,
    detenerEscaner
});



</script>
<style scoped>
/* Estilos para el contenedor del escáner */
#reader {
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    max-height: none !important;
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