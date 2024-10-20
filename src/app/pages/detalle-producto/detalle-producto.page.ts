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

  constructor(private dbService: DatabaseService, private storage: Storage, private router: Router, private alertController: AlertController) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se Ha Añadido Al Carro',
      buttons: ['Entendido'],
    });

    await alert.present();
    await this.router.navigate(['/cart']);
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

  /*agregarAlCarrito() {
    if (this.producto) {
      this.dbService.agregarProductoAlCarrito(this.producto); // Agregar producto al carrito
      this.storage.set('carrito', this.producto.id_prod); // Guardar la ID del producto en el Storage
      this.presentAlert();// Mostrar alerta
    }
  }*/
}
