
import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

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

  combos = [
    {
      imagen: 'assets/combo-peperonibebida.jpg',
      nombre: 'Combo Pizza de peperoni + Bebida ',
      precio: 7000,
    },
    {
      imagen: 'assets/combo-pizzapapasaroslata.png',
      nombre: 'Combo Pizza, Papitas, Aros de cebolla, Empanaditas, Lata',
      precio: 15000,
    },
    {
      imagen: 'assets/combo-pizzapapasbebida.webp',
      nombre: 'Combo Pizza, Papas, Bebida ',
      precio: 10000,
    },
    {
      imagen: 'assets/combo-trespizzaconpapasybebida.webp',
      nombre: 'Combo 3 Pizzas, Papas, Bebida',
      precio: 35000,
    },
  ];

  constructor(private navCtrl: NavController, private menu: MenuController) {}

  verPromocion() {
  
    this.navCtrl.navigateForward('/promocion-detalle');
  }

  verDetalleProducto(producto: any) {
    this.navCtrl.navigateForward('/detalle-producto', {
      queryParams: { producto: JSON.stringify(producto) },
    });
  }
  verDetallecombos(combos: any) {
    this.navCtrl.navigateForward('/detalle-combos', {
      queryParams: { combos: JSON.stringify(combos) },
    });
  }

}