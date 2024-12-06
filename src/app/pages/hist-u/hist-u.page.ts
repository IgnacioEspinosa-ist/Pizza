import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Pedido } from '../../services/pedido';
import { Storage } from '@ionic/storage-angular'; 
@Component({
  selector: 'app-hist-u',
  templateUrl: './hist-u.page.html',
  styleUrls: ['./hist-u.page.scss'],
})
export class HistUPage implements OnInit {
  pedidos: Pedido[] = [];
  userId: number | null = null; 

  constructor(private dbService: DatabaseService, private storage: Storage) {}

  async ngOnInit() {
   
    this.userId = await this.storage.get('id_user');
    if (this.userId) {
      this.fetchHistorialPedidos();
    } else {
      console.error('No se encontró id_user en el Storage.');
    }
  }

  fetchHistorialPedidos() {
    if (this.userId) {
      this.dbService.getHistorialPedidos(this.userId).subscribe({
        next: (data) => {
          this.pedidos = data;
        },
        error: (error) => {
          console.error('Error al obtener el historial de pedidos:', error);
        },
      });
    }
  }
}
