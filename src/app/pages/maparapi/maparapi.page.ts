import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-maparapi',
  templateUrl: './maparapi.page.html',
  styleUrls: ['./maparapi.page.scss'],
})
export class MaparapiPage implements OnInit {

  constructor(private alertController: AlertController,private router: Router) { }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se a confirmado el pedido.',
      buttons: ['Entendido'],
      
    });

 
    

    await alert.present();
    await this.router.navigate(['/homerepa']);
  }
  ngOnInit() {
  }

}