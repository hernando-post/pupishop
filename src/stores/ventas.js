
import { defineStore } from 'pinia';

export const useVentaStore = defineStore('venta', {
  state: () => ({
    codigoBarras: '',
    carrito: [],
    venta: {
      id_cliente: '',
      metodo_pago: ''
    }
  }),
  actions: {
    async agregarProducto() {
      const response = await fetch(`/api/productos/${this.codigoBarras}`);
      const producto = await response.json();

      const itemExistente = this.carrito.find(item => item.id_producto === producto.id_producto);
      if (itemExistente) {
        itemExistente.cantidad += 1;
        itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
      } else {
        this.carrito.push({
          ...producto,
          cantidad: 1,
          subtotal: producto.precio
        });
      }
      this.codigoBarras = '';
    },
    async finalizarVenta() {
      const ventaData = {
        id_cliente: this.venta.id_cliente,
        metodo_pago: this.venta.metodo_pago,
        productos: this.carrito
      };

      const response = await fetch('/api/ventas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ventaData)
      });

      if (response.ok) {
        alert('Venta registrada con éxito');
        this.carrito = [];
        this.venta.id_cliente = '';
        this.venta.metodo_pago = '';
      } else {
        alert('Error al registrar la venta');
      }
    }
  }
});
