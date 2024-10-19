import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/services/pedido';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.page.html',
  styleUrls: ['./detalle-pedido.page.scss'],
})
export class DetallePedidoPage implements OnInit {

  pedidosPendientes: Pedido[] = [];

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    
    };
  }
   

