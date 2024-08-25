
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  productos = [
    {
      imagen: 'assets/productos/pizza_pepperoni.jpg',
      nombre: 'Pizza Pepperoni',
      precio: 10.99,
    },
    {
      imagen: 'assets/productos/pizza_queso.jpg',
      nombre: 'Pizza de Queso',
      precio: 8.99,
    },
    {
      imagen: 'assets/productos/pizza_hawaiana.jpg',
      nombre: 'Pizza Hawaiana',
      precio: 11.99,
    },
    {
      imagen: 'assets/productos/pizza_vegetariana.jpg',
      nombre: 'Pizza Vegetariana',
      precio: 9.99,
    },
  ];

  constructor(private navCtrl: NavController) {}

  verPromocion() {
  
    this.navCtrl.navigateForward('/promocion-detalle');
  }

  verDetalleProducto(producto: any) {
    this.navCtrl.navigateForward('/detalle-producto', {
      queryParams: { producto: JSON.stringify(producto) },
    });
  }
}
