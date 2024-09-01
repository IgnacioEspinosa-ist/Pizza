import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  styleUrls: ['./ayuda.page.scss'],
})
export class AyudaPage implements OnInit {

  constructor(private alertController: AlertController, private menu: MenuController) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se Ha Enviado El Correo',
      buttons: ['Entendido'],
    });

    await alert.present();
  }

  ngOnInit() {
  }

  
  openMenuSecundario() {
    this.menu.open('menuSecundario'); 
  }

}

