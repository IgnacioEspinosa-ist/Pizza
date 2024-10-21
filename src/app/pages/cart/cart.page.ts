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

  async buscarProductoPorId(id_prod: number): Promise<void> {
    try {
      // Obtener el carrito almacenado
      const storedCarrito: Producto[] = await this.storage.get('carrito') || [];

      // Buscar el producto por su id en el carrito
      const productoEncontrado = storedCarrito.find(p => p.id_prod === id_prod);

      if (productoEncontrado) {
        // Si el producto es encontrado, mostrar alerta con detalles del producto
        const alert = await this.alertController.create({
          header: 'Producto Encontrado',
          message: `Producto: ${productoEncontrado.nombre} \nPrecio: ${productoEncontrado.precio}`,
          buttons: ['Entendido']
        });
        await alert.present();
      } else {
        // Si no se encuentra el producto, mostrar una alerta de error
        const alert = await this.alertController.create({
          header: 'Producto No Encontrado',
          message: `No se encontró un producto con el ID: ${id_prod}.`,
          buttons: ['Entendido']
        });
        await alert.present();
      }
    } catch (error) {
      // Manejo de errores en caso de fallo al acceder al almacenamiento o la base de datos
      const alert = await this.alertController.create({
        header: 'Error',
        message: `Ocurrió un error al intentar buscar el producto: ${error}`,
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
