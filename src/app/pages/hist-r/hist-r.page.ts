import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Pedido } from '../../services/pedido';

@Component({
  selector: 'app-hist-r',
  templateUrl: './hist-r.page.html',
  styleUrls: ['./hist-r.page.scss'],
})
export class HistRPage implements OnInit {
  pedidos: Pedido[] = []; // Lista de pedidos para mostrar

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.fetchTodosLosPedidos(); // Cargar todos los pedidos al iniciar
  }

  fetchTodosLosPedidos() {
    this.dbService.getPedidosEntregados().subscribe({
      next: (data) => {
        this.pedidos = data; // Asignar los pedidos al arreglo
      },
      error: (error) => {
        console.error('Error al obtener todos los pedidos:', error);
      },
    });
  }
}
