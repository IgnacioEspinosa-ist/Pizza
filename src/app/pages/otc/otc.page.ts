import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-otc',
  templateUrl: './otc.page.html',
  styleUrls: ['./otc.page.scss'],
})
export class OtcPage implements OnInit {

  constructor(private alertController: AlertController) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se Ha Enviado El Correo',
      buttons: ['Entendido'],
    });

    await alert.present();
  }

  ngOnInit() {
  }

}
