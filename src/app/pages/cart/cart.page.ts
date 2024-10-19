import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
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
  id_user: number | null = null; // Agregar propiedad para el ID del usuario
  id_direccion: number | null = null; // Agregar propiedad para el ID de la dirección

  constructor(
    private alertController: AlertController,
    private dbService: DatabaseService,
    private storage: Storage
  ) { }

  async ngOnInit() {
    await this.storage.create();
  
    // Obtener IDs del carrito desde el Storage
    const idsCarrito = await this.storage.get('carrito');
    
    if (idsCarrito) {
      this.dbService.getProductosPorIds(idsCarrito).subscribe((data: Producto[]) => {
        this.carrito = data;
      });
    }
  
    // Obtener el ID del usuario
    this.dbService.getUserId().subscribe(userId => {
      this.id_user = userId; // Asigna el ID del usuario
      if (this.id_user) {
        // Obtener direcciones del usuario
        this.dbService.getDireccionByUserId(this.id_user).subscribe(direcciones => {
          // Asignar la primera dirección como id_direccion
          if (direcciones.length > 0) {
            this.id_direccion = direcciones[0].id_direccion;
          }
        });
      }
    });}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    await alert.present();
  }

  agregarProducto(producto: Producto): void {
    this.dbService.agregarProductoAlCarrito(producto);
    this.storage.set('carrito', this.carrito.map(p => p.id_prod));
  }

  eliminarProducto(id_prod: number): void {
    this.dbService.eliminarProductoDelCarrito(id_prod);
    this.actualizarStorage();
  }

  vaciarCarrito(): void {
    this.dbService.vaciarCarrito();
    this.storage.remove('carrito');
  }

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }

  finalizarCompra() {
    if (this.id_user === null || this.id_direccion === null) {
        console.warn('ID de usuario o dirección no disponibles');
        return; // Asegúrate de que ambos IDs estén disponibles
    }

    const total = this.obtenerTotalCarrito();
  
    // Agregar pedido y detalles del pedido
    this.dbService.addPedido(total, this.id_user, this.id_direccion).subscribe({
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

  async actualizarStorage() {
    const idsCarrito = this.carrito.map(p => p.id_prod);
    await this.storage.set('carrito', idsCarrito);
  }
}
