import { Component } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Producto } from '../services/producto';
import { Storage } from '@ionic/storage-angular';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  productos: Producto[] = [];

  constructor(
    private router: Router, 
    private menu: MenuController, 
    private dbService: DatabaseService,
    private storage: Storage,
    private carritoService: CarritoService,
    private alertController: AlertController
  ) {}



  async agregarAlCarrito(producto: Producto) {
    try {
      // Llama al servicio del carrito para agregar el producto
      this.carritoService.agregarProducto(producto);

      // Muestra un mensaje de confirmación
      const alert = await this.alertController.create({
        header: 'Añadido al carrito',
        message: `El producto "${producto.nombre}" se añadió al carrito.`,
        buttons: ['Entendido'],
      });
      await alert.present();
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
    }}


  async ngOnInit() {
    await this.storage.create(); 
    // Suscribirse al observable de productos
    this.dbService.productos$.subscribe((data: Producto[]) => {
      this.productos = data;
    });

    // Llamar al método para obtener los productos
    this.dbService.fetchProductos();
  }

  

  async verDetalleProducto(producto: Producto) {
    // Almacenar el id del producto en Storage
    try {
      const arregloProductos = await this.storage.get('selectedProductId');
      arregloProductos.push(producto.id_prod)
      await this.storage.set('selectedProductId', arregloProductos);
    } catch (error) {
      const arregloProductos = [producto.id_prod]
      await this.storage.set('selectedProductId', arregloProductos);
    }
    

    // Navegar a la página de detalle del producto
    this.router.navigate(['/detalle-producto']);
  }
}
