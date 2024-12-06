



import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';  
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
  productos: Producto[] = [];  
  totalCarrito: number = 0;   
  totalFormateado: string = '';
  constructor(
    private dbService: DatabaseService,
    private carritoService: CarritoService,  
    private alertController: AlertController,
    private storage: Storage,
    private router: Router
  ) {}

  async ngOnInit() {
    const idUser = await this.storage.get('id_user');
    if (!idUser) {
      console.error('No se encontró id_user en el almacenamiento.');
      return;
    }
    this.productos = await this.carritoService.obtenerProductos();
    this.calcularTotal();
  }
  

  
  actualizarCarrito() {
    this.productos = this.carritoService.obtenerProductos();
    this.calcularTotal(); 
  }

 
  async eliminarProductoDelCarrito(id_prod: number): Promise<void> {
    try {
      this.carritoService.quitarProducto(id_prod); 
      this.actualizarCarrito(); 
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

  
  calcularTotal(): void {
 
    const total = this.productos.reduce((suma, producto) => 
      suma + (producto.precio * (producto.cantidad || 0)), 
      0
    );
  
   
    this.totalCarrito = total;
  
   
    this.totalFormateado = total.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  }

 
  vaciarCarrito() {
    this.carritoService.vaciarCarrito();  
    this.actualizarCarrito(); 
  }

 
  async finalizarCompra() {
    if (!this.productos || this.productos.length === 0) {
      console.error('El carrito está vacío, no se puede finalizar la compra.');
      return;
    }
  
    try {
      const idUser = await this.storage.get('id_user');
      if (!idUser) {
        console.error('No se pudo obtener el id_user del almacenamiento.');
        return;
      }
  
      // Chequeo de stock para cada producto
      for (const producto of this.productos) {
        if (producto.cantidad && producto.stock !== undefined) {
          if (producto.cantidad > producto.stock) {
            const alert = await this.alertController.create({
              header: 'Stock insuficiente',
              message: `El producto "${producto.nombre}" no tiene suficiente stock. Disponible: ${producto.stock}.`,
              buttons: ['Entendido'],
            });
            await alert.present();
            return; // Detiene la ejecución si algún producto no tiene stock suficiente
          }
        }
      }
  
      // Crear el nuevo pedido
      const nuevoPedido = {
        f_pedido: new Date().toISOString().slice(0, 10),
        id_user: idUser,
        id_direccion: 1,
        total: this.totalCarrito,
        id_user_resp: undefined,
        estatus: 'pendiente'
      };
  
      await this.dbService.agregarPedido(nuevoPedido);
  
      // Actualizar el stock de los productos
      for (const producto of this.productos) {
        if (producto.cantidad && producto.stock !== undefined) {
          const nuevoStock = producto.stock - producto.cantidad;
          await this.dbService.actualizarStockProducto(producto.id_prod, nuevoStock);
        }
      }
  
      // Vaciar el carrito
      this.vaciarCarrito();
  
      // Redirigir a otra página
      this.router.navigate(['/mapacli']);
  
      console.log('Compra finalizada con éxito.');
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
    }
  }
  
  
  


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    await alert.present();
  }

 
aumentarCantidad(id_prod: number, cantidad: number | undefined): void {
  if (cantidad !== undefined) {
  
    const nuevaCantidad = cantidad + 1;


    this.carritoService.actualizarCantidad(id_prod, nuevaCantidad);

 
    this.productos = this.carritoService.obtenerProductos();

   
    this.calcularTotal();
  } else {
    console.error('Cantidad es undefined. No se puede aumentar la cantidad.');
  }
}



disminuirCantidad(id_prod: number, cantidad: number | undefined) {
  if (cantidad !== undefined && cantidad > 1) {
    this.carritoService.actualizarCantidad(id_prod, cantidad - 1);
    this.productos = this.carritoService.obtenerProductos();  
    this.calcularTotal();  
  } else {
    console.error('Cantidad es undefined o no se puede disminuir más de 1.');
  }
} 



}
