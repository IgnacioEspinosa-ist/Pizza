// reportes.page.ts
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Pedido } from 'src/app/services/pedido'; // Asegúrate de importar el modelo Pedido

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  pedidosEntregados: Pedido[] = []; // Para almacenar los pedidos entregados
  totalVentas: number = 0;

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    // Llamar a fetchReportesEntregados() para obtener los pedidos entregados
    this.fetchReportesEntregados();
  }

  fetchReportesEntregados() {
    // Llama al método del servicio para obtener los pedidos entregados
    this.dbService.fetchPedidosEntregados();  // Asegúrate de que este método esté siendo llamado

    // Suscribirse a los cambios de la lista de pedidos entregados
    this.dbService.pedidosEntregadosList.subscribe((pedidos: Pedido[]) => {
      this.pedidosEntregados = pedidos;

      // Calcular el total de las ventas
      this.totalVentas = this.pedidosEntregados.reduce((total, pedido) => {
        return total + pedido.total; // Sumar el total de cada pedido
      }, 0); // Inicializamos en 0
    });
  }
}
