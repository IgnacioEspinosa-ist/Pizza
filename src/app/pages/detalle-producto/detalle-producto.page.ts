import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/services/producto';

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
    private alertController: AlertController
  ) {}

  // Método para mostrar una alerta cuando se añade al carrito
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Producto Añadido al Carrito',
      buttons: ['Entendido'],
    });

    await alert.present();
    await this.router.navigate(['/cart']); // Navegar al carrito después de añadir
  }

  // Método para agregar el producto al carrito
  agregarAlCarrito() {
    if (this.producto) {
      this.dbService.agregarProductoAlCarrito(this.producto); // Agregar el producto al carrito
      this.presentAlert(); // Mostrar alerta y redirigir al carrito
    }
  }

  // Obtener detalles del producto al inicializar la página
  async ngOnInit() {
    await this.storage.create(); // Inicializar el Storage

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
}
