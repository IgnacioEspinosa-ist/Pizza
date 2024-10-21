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
  carrito: Producto[] = [];
  productos: Producto[] = []; 
  id_user: number | null = null;
  id_direccion: number | null = null;

  constructor(
    private alertController: AlertController,
    private carritoService: CarritoService,
    private dbService: DatabaseService,
    private storage: Storage,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.storage.create();
    
    const storedCarrito = await this.storage.get('selectedProductId'); // Cambiar a 'carrito'

    this.alertController.create({
      header: 'storedCarrito'+ JSON.stringify(storedCarrito),
      buttons: ['entendido']
    })

    this.productos = this.dbService.getProductoById(storedCarrito)

    
/*
    if (storedCarrito) {
        this.carrito = storedCarrito;
    }

    this.dbService.productos$.subscribe((data: Producto[]) => {
        this.productos = data; 
    });

    this.dbService.fetchProductos(); */
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    alert.present(); // Eliminar 'await'
  }

  async agregarProducto(producto: Producto): Promise<void> {
    this.carritoService.agregarProducto(producto);
    await this.actualizarStorage();
  }

  async eliminarProducto(id_prod: number): Promise<void> {
    this.carritoService.quitarProducto(id_prod);
    await this.actualizarStorage();
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
    this.storage.remove('carrito'); // Cambiar a 'carrito'
  }

  obtenerTotalCarrito(): number {
    return this.carritoService.obtenerTotalProductos();
  }

  async actualizarStorage() {
    await this.storage.set('carrito', this.carritoService.obtenerProductos()); // Cambiar a 'carrito'
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

  async agregarProductoAlCarrito() {
    const productId = await this.storage.get('selectedProductId'); 
    
    if (productId) {
        const producto = this.productos.find(p => p.id_prod === productId);
    
        if (producto) {
            this.carritoService.agregarProducto(producto);
            await this.actualizarStorage(); // Asegúrate de esperar
        } else {
            console.error('Producto no encontrado');
        }
    }
}

  async verDetalleProducto(producto: Producto) {
    await this.storage.set('selectedProductId', producto.id_prod);
    this.router.navigate(['/detalle-producto']);
  }
}
