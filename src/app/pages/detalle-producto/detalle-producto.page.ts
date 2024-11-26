import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/services/producto';
import { CarritoService } from 'src/app/services/carrito.service'; 

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
    private carritoService: CarritoService 
  ) {}

 
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se Ha Añadido Al Carro',
      buttons: ['Entendido'],
    });

    await alert.present();

   
    if (this.producto) {
      this.router.navigate(['/cart']);
    }
  }

  async ngOnInit() {
    await this.storage.create(); 

    
    const productId = await this.storage.get('selectedProductId');

    if (productId) {
     
      this.dbService.getProductoById(productId).subscribe({
        next: (producto: Producto) => {
          this.producto = producto; 
        },
        error: (error: any) => {
          console.error('Error al cargar el producto:', error);
        }
      });
    }
  }

 
  agregarAlCarrito() {
    if (this.producto) {
    
      this.carritoService.agregarProducto(this.producto); 

     
      this.presentAlert();

    
      this.router.navigate(['/cart']);
    }
  }

  async ngOnDestroy() {
    await this.storage.remove('selectedProductId');
    console.log('Producto seleccionado eliminado del storage');
  }
}
