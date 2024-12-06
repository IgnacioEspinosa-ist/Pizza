
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Pedido } from 'src/app/services/pedido'; 
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  pedidosEntregados: Pedido[] = []; 
  totalVentas: number = 0;

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
 
    this.fetchReportesEntregados();
  }

  fetchReportesEntregados() {
    this.dbService.fetchPedidosEntregados();  


    this.dbService.pedidosEntregadosList.subscribe((pedidos: Pedido[]) => {
      this.pedidosEntregados = pedidos;


      this.totalVentas = this.pedidosEntregados.reduce((total, pedido) => {
        return total + pedido.total; 
      }, 0); 
    });
  }
}
