import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-otc',
  templateUrl: './otc.page.html',
  styleUrls: ['./otc.page.scss'],
})
export class OtcPage implements OnInit {

  constructor(private alertController: AlertController, private dbService: DatabaseService) {}

  email: string = ''
  async onResetPassword() {
    if (!this.validateEmail(this.email)) {
      await this.presentAlert('Correo no válido', 'Por favor ingresa un correo con el formato correcto.');
      return;
    }

    const emailExists = await this.dbService.checkEmailExists(this.email);

    if (emailExists) {
      await this.presentAlert('Correo encontrado', 'Se ha enviado un correo de recuperación.');
     
    } else {
      await this.presentAlert('Correo no encontrado', 'El correo no está registrado en nuestra base de datos.');
    }
  }

  // Método para validar el formato del correo
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  ngOnInit() {
  }
  // Método para mostrar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

  

