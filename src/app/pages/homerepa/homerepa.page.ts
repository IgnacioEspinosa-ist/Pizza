
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-homerepa',
  templateUrl: './homerepa.page.html',
  styleUrls: ['./homerepa.page.scss'],
})
export class HomerepaPage {
  productos = [
    {
      imagen: 'assets/productos/pizza_pepperoni.jpg',
      nombre: 'Beronica',
      destino: 'dancing 856915',
    },
    {
      imagen: 'assets/productos/pizza_queso.jpg',
      nombre: 'Juanito',
      destino: 'tupungato 159485'
    },
    {
      imagen: 'assets/productos/pizza_hawaiana.jpg',
      nombre: 'Pepito',
      destino: 'argel 4864489'
    },

  ];

  constructor(private navCtrl: NavController) {}

  verDetalleProducto(producto: any) {
    this.navCtrl.navigateForward('/detalle-producto', {
      queryParams: { producto: JSON.stringify(producto) },
    });
  }
}
