import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service'; 
import { DatabaseService } from 'src/app/services/database.service'; 
import { Producto } from 'src/app/services/producto';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  carrito: Producto[] = [];
  id_user: number | null = null; 
  id_direccion: number | null = null; 

  constructor(
    private alertController: AlertController,
    private carritoService: CarritoService, 
    private dbService: DatabaseService, 
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create();
    this.carrito = this.carritoService.obtenerProductos();
    const idsCarrito = await this.storage.get('carrito');

    if (idsCarrito) {
      
    }
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    await alert.present();
  }

  agregarProducto(producto: Producto): void {
    this.carritoService.agregarProducto(producto);
    this.actualizarStorage();
  }

  eliminarProducto(id_prod: number): void {
    this.carritoService.quitarProducto(id_prod);
    this.actualizarStorage();
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
    this.storage.remove('carrito');
  }

  obtenerTotalCarrito(): number {
    return this.carritoService.obtenerTotalProductos();
  }

  async actualizarStorage() {
    const idsCarrito = this.carrito.map(p => p.id_prod);
    await this.storage.set('carrito', idsCarrito);
  }

  finalizarCompra() {
    if (this.id_user === null || this.id_direccion === null) {
      console.warn('ID de usuario o dirección no disponibles');
      return;
    }

    const total = this.obtenerTotalCarrito();

    this.dbService.addPedido(total, this.id_user, this.id_direccion).subscribe({
      next: (id_pedido: number) => {
        this.dbService.addDetallePedido(id_pedido, this.carrito).subscribe({
          next: () => {
            this.presentAlert();
            this.vaciarCarrito(); 
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
}
