import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-rescontrasena',
  templateUrl: './rescontrasena.page.html',
  styleUrls: ['./rescontrasena.page.scss'],
})
export class RescontrasenaPage implements OnInit {
  enteredCode: string = ''; 
  recoveryCode: string | null = null; 
  email: string | null = null; 

  constructor(private storage: Storage, private alertController: AlertController, private navCtrl: NavController) {}

  async ngOnInit() {

    this.recoveryCode = await this.storage.get('recoveryCode');
    this.email = await this.storage.get('email');
  }

  async verifyCode() {
    if (!this.enteredCode) {
      await this.presentAlert('Error', 'Por favor ingresa el código de recuperación.');
      return;
    }

    if (this.enteredCode === this.recoveryCode) {
      await this.presentAlert('Éxito', 'Código válido. Ahora puedes cambiar tu contraseña.');
      this.navCtrl.navigateForward('/cambiar-contrasena'); 
    } else {
      await this.presentAlert('Error', 'El código ingresado es incorrecto. Por favor verifica e intenta nuevamente.');
    }
  }


  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
