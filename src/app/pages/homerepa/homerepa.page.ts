
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Pedido } from 'src/app/services/pedido';

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


  pedidosPendientes: Pedido[] = [];

  constructor(
    private dbService: DatabaseService,
    private alertController: AlertController,
    private menu: MenuController,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener los pedidos pendientes al cargar la página
    this.dbService.pedidosPendientes$.subscribe((data: Pedido[]) => {
      this.pedidosPendientes = data;
    });
    this.dbService.obtenerPedidosPendientes(); // Llamar al método para obtener los pedidos
  }
  openMenuSecundario() {
    this.menu.open('menuSecundario'); 
  }

  irAMapaRepartidor(pedido: Pedido) {
    // Navegar a la página del mapa, pasando el pedido seleccionado
    this.router.navigate(['/maparepa'], {
      queryParams: {
        id_pedido: pedido.id_pedido,
        id_user: pedido.id_user,
      }})}};

  



  
    
