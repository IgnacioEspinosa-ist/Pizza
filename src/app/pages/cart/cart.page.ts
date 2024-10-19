import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/services/producto';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  carrito: Producto[] = [];

  constructor(
    private alertController: AlertController,
    private dbService: DatabaseService
  ) { }

  ngOnInit() {
    // Suscribirse al carrito desde el servicio
    this.dbService.carrito$.subscribe((data: Producto[]) => {
      this.carrito = data;
    });

    // Obtener el carrito al iniciar la página
    this.dbService.obtenerCarrito();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    await alert.present();
  }

  agregarProducto(producto: Producto): void {
    this.dbService.agregarProductoAlCarrito(producto);
  }

  eliminarProducto(id_prod: number): void {
    this.dbService.eliminarProductoDelCarrito(id_prod);
  }

  vaciarCarrito(): void {
    this.dbService.vaciarCarrito();
  }

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  // Nueva función para finalizar la compra y añadir detalles a la tabla de pedidos
  finalizarCompra(id_user: number, id_direccion: number) {
    const total = this.obtenerTotalCarrito();

    // Agregar pedido y detalles del pedido
    this.dbService.addPedido(total, id_user, id_direccion).subscribe({
      next: (id_pedido: number) => {
        // Luego de obtener el ID del pedido, agregamos los detalles
        this.dbService.addDetallePedido(id_pedido, this.carrito).subscribe({
          next: () => {
            // Mostrar alerta de éxito
            this.presentAlert();
            this.vaciarCarrito(); // Limpiar el carrito después de la compra
          },
          error: (error) => {
            console.error('Error al agregar detalles del pedido:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al agregar el pedido:', error);
      }
    });
  }

  obtenerTotalCarrito(): number {
    return this.carrito.reduce((total, item) => total + item.precio * item.stock, 0);
  }
}
