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
    await this.storage.create(); // Inicializar Storage

    // Obtener los IDs de los productos en el carrito desde Storage
    const storedCarrito: number[] = await this.storage.get('cartItems') || [];

    // Para cada ID, obtener los detalles del producto desde la base de datos
    for (const id of storedCarrito) {
      this.dbService.getProductoById(id).subscribe({
        next: (producto: Producto) => {
          this.productos.push(producto); // Añadir cada producto a la lista de productos en el carrito
        },
        error: (error: any) => {
          console.error('Error al cargar el producto:', error);
        }
      });
    }
  }

  async eliminarProductoDelCarrito(id_prod: number): Promise<void> {
    try {
      // Obtener el carrito almacenado
      const storedCarrito: number[] = await this.storage.get('cartItems') || [];
      
      // Eliminar el ID del producto del carrito
      const indice = storedCarrito.indexOf(id_prod);
      if (indice !== -1) {
        storedCarrito.splice(indice, 1);
        await this.storage.set('cartItems', storedCarrito);

        // Eliminar el producto de la lista de productos mostrada
        this.productos = this.productos.filter(producto => producto.id_prod !== id_prod);

        // Mostrar alerta de confirmación
        const alert = await this.alertController.create({
          header: 'Producto Eliminado',
          message: `El producto ha sido eliminado del carrito.`,
          buttons: ['Entendido']
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Producto no encontrado',
          message: 'El producto no se encontró en el carrito.',
          buttons: ['Entendido']
        });
        await alert.present();
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: `Ocurrió un error: ${error}`,
        buttons: ['Entendido']
      });
      await alert.present();
    }
  }

  async agregarProductoAlCarrito() {
    const productId = await this.storage.get('selectedProductId');

    if (productId) {
      // Agregar el ID del producto al carrito en Storage
      const cartItems: number[] = await this.storage.get('cartItems') || [];
      if (!cartItems.includes(productId)) {
        cartItems.push(productId);
        await this.storage.set('cartItems', cartItems);

        // Obtener los detalles del producto y añadirlo a la lista de productos en el carrito
        this.dbService.getProductoById(productId).subscribe({
          next: (producto: Producto) => {
            this.productos.push(producto);
          },
          error: (error) => {
            console.error('Error al cargar el producto:', error);
          }
        });
      }
    }
  }

  vaciarCarrito(): void {
    this.productos = [];
    this.storage.set('cartItems', []);
  }

  obtenerTotalCarrito(): number {
    return this.productos.reduce((total, producto) => total + (producto.precio * producto.stock), 0);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });
    await alert.present();
  }

  finalizarCompra() {
    if (this.id_user === null) {
      console.warn('ID de usuario no disponible');
      return;
    }

    const total = this.obtenerTotalCarrito();
    
    this.dbService.addPedido(total, this.id_user).subscribe({
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
    await this.storage.set('selectedProductId', producto.id_prod);
    this.router.navigate(['/detalle-producto']);
  }
}
