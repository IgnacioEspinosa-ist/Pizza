import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/services/producto';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  carrito: Producto[] = [];

  constructor(
    private alertController: AlertController,
    private dbService: DatabaseService
  ) { }

  ngOnInit() {
    // Suscribirse al carrito desde el servicio
    this.dbService.carrito$.subscribe((data: Producto[]) => {
      this.carrito = data;
    });

    // Obtener el carrito al iniciar la página
    this.dbService.obtenerCarrito();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    await alert.present();
  }

  agregarProducto(producto: Producto): void {
    this.dbService.agregarProductoAlCarrito(producto);
  }

  eliminarProducto(id_prod: number): void {
    this.dbService.eliminarProductoDelCarrito(id_prod);
  }

  vaciarCarrito(): void {
    this.dbService.vaciarCarrito();
  }

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }
}
