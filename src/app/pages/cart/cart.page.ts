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
      header: 'storedCarrito' + JSON.stringify(storedCarrito),
      buttons: ['entendido']
    })

    this.productos = this.dbService.getProductosById(storedCarrito)


    /*
        if (storedCarrito) {
            this.carrito = storedCarrito;
        }
    
        this.dbService.productos$.subscribe((data: Producto[]) => {
            this.productos = data; 
        });
    
        this.dbService.fetchProductos(); */
  }


  //aquiiiiiiiii
  //buscarProductoPorId

  async eliminarProductoDelCarrito(id_prod: number): Promise<void> {
    try {
      // Obtener el carrito almacenado desde Native Storage
      const storedCarrito: Producto[] = await this.storage.get('selectedProductId') || [];
      const indice = storedCarrito.findIndex(producto => producto.id_prod === id_prod);

      // Verificar si el índice es válido
      if (indice !== -1) {
        const productoEliminado = storedCarrito[indice]

        // Eliminar el producto del carrito
        storedCarrito.splice(indice, 1);
        await this.storage.set('selectedProductId', storedCarrito);

        const alert = await this.alertController.create({
          header: 'Producto Eliminado',
          message: `El producto "${productoEliminado.nombre}" ha sido eliminado del carrito.`,
          buttons: ['Entendido']
        });
        await alert.present();
      } else {
        const alert = await this.alertController.create({
          header: 'Índice No Válido',
          message: 'El índice especificado no es válido.',
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



  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    alert.present();
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
    this.productos = []
    this.storage.set('selectedProductId', []);
  }

  obtenerTotalCarrito(): number {
    return this.productos.reduce((total, producto) => total + (producto.precio * producto.stock), 0);
  }

  async actualizarStorage() {
    await this.storage.set('carrito', this.carritoService.obtenerProductos());
  }

  finalizarCompra() {
    if (this.id_user === null) {
      console.warn('ID de usuario no disponible');
      return;
    }
  
    const total = this.obtenerTotalCarrito();
  
    // Insertar el pedido sin la dirección
    this.dbService.addPedido(total, this.id_user, null!).subscribe({
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
        await this.actualizarStorage();
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
