import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapaService } from 'src/app/services/mapa.service';
import { AlertController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './maparapi.page.html',
  styleUrls: ['./maparapi.page.scss']
})
export class MapaComponent implements OnInit, OnDestroy {

  constructor(private mapaService: MapaService, private alertController: AlertController, private router: Router) { }


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
    this.mapaService.initializeMap('map'); // Llama al método del servicio
  }

  ngOnDestroy() {
    this.mapaService.ngOnDestroy(); // Limpia el mapa si es necesario
  }
}  


