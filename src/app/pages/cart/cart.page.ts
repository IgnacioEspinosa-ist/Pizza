import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';  // Este servicio gestionará los productos del carrito
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/services/producto';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  productos: Producto[] = [];  // Lista de productos del carrito
  totalCarrito: number = 0;    // Total del carrito
  totalFormateado: string = '';
  constructor(
    private dbService: DatabaseService,
    private carritoService: CarritoService,  // Usando un servicio para gestionar el carrito
    private alertController: AlertController,
    private storage: Storage,
    private router: Router
  ) {}

  async ngOnInit() {
    // Cargar productos desde el carrito en el servicio
    this.productos = await this.carritoService.obtenerProductos();
    this.calcularTotal();
    await this.storage.remove('selectedProductId');  // Calcular el total después de cargar los productos
    const idUser = await this.storage.get('id_user');
  }

  // Actualiza la lista de productos en el carrito y calcula el total
  actualizarCarrito() {
    this.productos = this.carritoService.obtenerProductos();
    this.calcularTotal();  // Recalcular el total después de actualizar el carrito
  }

  // Función para eliminar producto del carrito
  async eliminarProductoDelCarrito(id_prod: number): Promise<void> {
    try {
      this.carritoService.quitarProducto(id_prod);  // Usamos el servicio para eliminar el producto
      this.actualizarCarrito();  // Actualizamos la lista del carrito
      const alert = await this.alertController.create({
        header: 'Producto Eliminado',
        message: 'El producto ha sido eliminado del carrito.',
        buttons: ['Entendido']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: `Ocurrió un error: ${error}`,
        buttons: ['Entendido']
      });
      await alert.present();
    }
  }

  // Función para calcular el total del carrito
  calcularTotal(): void {
    // Calcular el total sumando precio * cantidad para cada producto
    const total = this.productos.reduce((suma, producto) => 
      suma + (producto.precio * (producto.cantidad || 0)), 
      0
    );
  
    // Guardar el total en una variable
    this.totalCarrito = total;
  
    // Formatear el total para mostrarlo como moneda
    this.totalFormateado = total.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  }

  // Función para vaciar todo el carrito
  vaciarCarrito() {
    this.carritoService.vaciarCarrito();  // Limpiamos el carrito
    this.actualizarCarrito();  // Actualizamos la vista
  }

  // Función para finalizar la compra
  async finalizarCompra() {
    // Verifica si el carrito tiene productos antes de continuar
    if (!this.productos || this.productos.length === 0) {
      console.error('El carrito está vacío, no se puede finalizar la compra.');
      return;
    }
  
    try {
      // Obtén el id_user del storage
      const idUser = await this.storage.get('id_user');
      if (!idUser) {
        console.error('No se pudo obtener el id_user del almacenamiento.');
        return;
      }
  
      // Prepara los datos para la tabla pedido
      const nuevoPedido = {
        f_pedido: new Date().toISOString().slice(0, 10), // Fecha actual en formato YYYY-MM-DD
        id_user: idUser,                                // id_user desde el storage
        id_direccion: 1,                                // Dirección estática (puedes cambiar el valor)
        total: this.totalCarrito,                       // Total calculado
        id_user_resp: undefined,                        // Inicialmente undefined
        estatus: 'pendiente'                            // Estado inicial
      };
      
  
      // Inserta el pedido en la base de datos
      await this.dbService.agregarPedido(nuevoPedido);
  
      // Vacía el carrito después de finalizar la compra
      this.vaciarCarrito();
  
      // Navega a otra página (opcional)
      this.router.navigate(['/mapacli']);
  
      console.log('Compra finalizada con éxito.');
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
    }
  }
  
  

  // Mostrar alerta de compra exitosa
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    await alert.present();
  }

  // Función para aumentar la cantidad de un producto
// Función para aumentar la cantidad de un producto
aumentarCantidad(id_prod: number, cantidad: number | undefined): void {
  if (cantidad !== undefined) {
    // Incrementamos la cantidad
    const nuevaCantidad = cantidad + 1;

    // Actualizamos la cantidad del producto en el carrito
    this.carritoService.actualizarCantidad(id_prod, nuevaCantidad);

    // Refrescamos la lista de productos en el carrito
    this.productos = this.carritoService.obtenerProductos();

    // Recalculamos el total del carrito
    this.calcularTotal();
  } else {
    console.error('Cantidad es undefined. No se puede aumentar la cantidad.');
  }
}


// Función para disminuir la cantidad de un producto
disminuirCantidad(id_prod: number, cantidad: number | undefined) {
  if (cantidad !== undefined && cantidad > 1) {
    this.carritoService.actualizarCantidad(id_prod, cantidad - 1);
    this.productos = this.carritoService.obtenerProductos();  // Actualizamos la lista del carrito
    this.calcularTotal();  // Recalculamos el total
  } else {
    console.error('Cantidad es undefined o no se puede disminuir más de 1.');
  }
} 



}

