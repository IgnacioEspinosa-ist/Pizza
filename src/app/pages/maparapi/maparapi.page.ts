import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapacliService } from 'src/app/services/mapacli.service';
import { AlertController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './maparapi.page.html',
  styleUrls: ['./maparapi.page.scss']
})
export class MapaComponent implements OnInit, OnDestroy {
  

  
  constructor(private route: ActivatedRoute,private mapaService: MapacliService,private dbService: DatabaseService, private alertController: AlertController, private router: Router) {
    
  }
  
  id_pedido!: number;
  direccion!: string;
  id_user!: number;
  

  ngOnDestroy() {
    this.mapaService.ngOnDestroy(); // Limpia el mapa si es necesario
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se a confirmado el pedido.',
      buttons: ['Entendido'],
      
    });
  
  
    
  
    await alert.present();
    await this.router.navigate(['/homerepa']);
  }
 

  ngOnInit() {
    // Inicializar el mapa aquí con el ID del contenedor
    this.mapaService.initializeMap('mapContainer');
    this.route.queryParams.subscribe(params => {
      this.id_pedido = params['id_pedido'];
      this.direccion = params['direccion'];
      this.id_user = params['id_user'];
  })}

  

  async marcarComoEntregado(id_pedido: number) {
    // Mostrar un mensaje de confirmación antes de marcar como entregado
    const alert = await this.alertController.create({
      header: 'Confirmar Entrega',
      message: '¿Estás seguro de que quieres marcar este pedido como entregado?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí, entregar',
          handler: () => {
            // Actualizar el estado del pedido a "entregado"
            this.dbService.marcarPedidoComoEntregado(id_pedido).subscribe({
              next: () => {
                // Actualizar la lista de pedidos pendientes
                this.dbService.obtenerPedidosPendientes();
                this.mostrarAlertExito();
                this.router.navigate(['/homerepa']);
              },
              error: (error) => {
                console.error('Error al marcar el pedido como entregado:', error);
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarAlertExito() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'El pedido ha sido marcado como entregado.',
      buttons: ['OK']
    });
    await alert.present();
  }

}  


