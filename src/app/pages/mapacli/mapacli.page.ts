import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { MapaService } from 'src/app/services/mapa.service';

@Component({
  selector: 'app-mapacli',
  templateUrl: './mapacli.page.html',
  styleUrls: ['./mapacli.page.scss'],
})
export class MapacliPage {

  constructor(private mapaService: MapaService, private alertController: AlertController, private router: Router) { }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se a confirmado el pedido.',
      buttons: ['Entendido'],
      
    });
  
  
    
  
    await alert.present();
    await this.router.navigate(['/home']);
  }
  

  ngOnInit() {
    
    this.mapaService.initializeMap('map'); 
  }

  ngOnDestroy() {
    this.mapaService.ngOnDestroy(); 
  }
}  
