
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
      precio: 12000,
    },
    {
      imagen: 'assets/productos/pizza_queso.jpg',
      nombre: 'Pizza de Queso',
      precio: 8000,
    },
    {
      imagen: 'assets/productos/pizza_hawaiana.jpg',
      nombre: 'Pizza Hawaiana',
      precio: 10000,
    },
    {
      imagen: 'assets/productos/pizza_vegetariana.jpg',
      nombre: 'Pizza Vegetariana',
      precio: 8000,
    },
    {
      imagen: '',
      nombre: 'Pizza Jamón-Queso',
      precio: 8000,


    },

    {
      imagen: '',
      nombre: 'Champizza',
      precio: 12000,


    },

    {
      imagen: '',
      nombre: 'Piboqueso',
      precio: 15000,


    },

    {
      imagen: '',
      nombre: 'Masa',
      precio: 1500,


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
