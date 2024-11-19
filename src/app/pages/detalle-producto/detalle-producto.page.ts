import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/services/producto';
import { CarritoService } from 'src/app/services/carrito.service'; // Suponiendo que tienes un CarritoService

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {
  producto: Producto | null = null;

  constructor(
    private dbService: DatabaseService,
    private storage: Storage,
    private router: Router,
    private alertController: AlertController,
    private carritoService: CarritoService // Agregar CarritoService
  ) {}

  // Mostrar alerta cuando se agrega el producto al carrito
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se Ha Añadido Al Carro',
      buttons: ['Entendido'],
    });

    await alert.present();

    // Navegar al carrito pasando el producto como parámetro
    if (this.producto) {
      this.router.navigate(['/cart']);
    }
  }

  async ngOnInit() {
    await this.storage.create(); // Inicializar Storage

    // Recuperar el id del producto desde el Storage
    const productId = await this.storage.get('selectedProductId');

    if (productId) {
      // Obtener los detalles del producto desde la base de datos
      this.dbService.getProductoById(productId).subscribe({
        next: (producto: Producto) => {
          this.producto = producto; // Asignar el producto a la variable local
        },
        error: (error: any) => {
          console.error('Error al cargar el producto:', error);
        }
      });
    }
  }

  // Función para agregar el producto al carrito
  agregarAlCarrito() {
    if (this.producto) {
      // Usar el servicio de carrito para agregar el producto completo
      this.carritoService.agregarProducto(this.producto);  // Añadir el producto al carrito

      // Mostrar alerta
      this.presentAlert();

      // Navegar al carrito
      this.router.navigate(['/cart']);
    }
  }
}
