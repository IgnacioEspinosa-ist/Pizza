import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/services/producto';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router'; // Asegúrate de importar Router

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  carrito: Producto[] = [];
  productos: Producto[] = []; // Agregar un array para los productos disponibles
  id_user: number | null = null;
  id_direccion: number | null = null;

  constructor(
    private alertController: AlertController,
    private carritoService: CarritoService,
    private dbService: DatabaseService,
    private storage: Storage,
    private router: Router // Inyectar el Router
  ) { }

  async ngOnInit() {
    await this.storage.create();
    this.carrito = this.carritoService.obtenerProductos(); // Obtener productos del carrito

    // Suscribirse al observable de productos
    this.dbService.productos$.subscribe((data: Producto[]) => {
      this.productos = data; // Asignar los productos obtenidos a la variable
    });

    // Llamar al método para obtener los productos
    this.dbService.fetchProductos();
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

  async verDetalleProducto(producto: Producto) {
    // Almacenar el id del producto en Storage
    await this.storage.set('selectedProductId', producto.id_prod);
    // Navegar a la página de detalle del producto
    this.router.navigate(['/detalle-producto']);
  }
}
