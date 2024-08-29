
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
      imagen: 'assets/peperoni.webp',
      nombre: 'Pizza Pepperoni',
      precio: 12000,
    },
    {
      imagen: 'assets/chees.webp',
      nombre: 'Pizza de Queso',
      precio: 8000,
    },
    {
      imagen: 'assets/jawai.jfif',
      nombre: 'Pizza Hawaiana',
      precio: 10000,
    },
    {
      imagen: 'assets/vegan.webp',
      nombre: 'Pizza Vegetariana',
      precio: 8000,
    },
    {
      imagen: 'assets/jam.png',
      nombre: 'Pizza Jamón-Queso',
      precio: 8000,


    },

    {
      imagen: 'assets/callam.png',
      nombre: 'Champizza',
      precio: 12000,


    },

    {
      imagen: 'assets/border.png',
      nombre: 'Piboqueso',
      precio: 15000,


    },

    {
      imagen: 'assets/deep.png',
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
