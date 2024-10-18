import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController} from '@ionic/angular';

import { Producto } from 'src/app/services/producto';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {
  private carrito: Producto[] = [];

  constructor(private alertController: AlertController,private router: Router) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Exito',
      buttons: ['Entendido'],
      
    });

 
    

    await alert.present();
    await this.router.navigate(['/mapacli']);
  }
  ngOnInit() {
  }

  agregarProducto(producto: Producto): void {
    const productoExistente = this.carrito.find(item => item.id_prod === producto.id_prod);
    if (productoExistente) {
      productoExistente.stock += 1;
    } else {
      this.carrito.push({ ...producto, stock: 1 });
    }
  }

  eliminarProducto(id: number): void {
    this.carrito = this.carrito.filter(item => item.id_prod !== id);
  }

  vaciarCarrito(): void {
    this.carrito = [];
  }

  obtenerCarrito(): Producto[] {
    return this.carrito;
  }
}

