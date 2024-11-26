import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import emailjs from 'emailjs-com';  
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otc',
  templateUrl: './otc.page.html',
  styleUrls: ['./otc.page.scss'],
})
export class OtcPage implements OnInit {

  email: string = '';  
  constructor(
    private alertController: AlertController, 
    private dbService: DatabaseService, 
    private storage: Storage,
    private router: Router
  ) {}

  async onResetPassword() {
    if (!this.validateEmail(this.email)) {
      await this.presentAlert('Correo no válido', 'Por favor ingresa un correo con el formato correcto.');
      return;
    }

    const emailExists = await this.dbService.checkEmailExists(this.email);

    if (emailExists) {
      const recoveryCode = Math.floor(100000 + Math.random() * 900000);
      await this.storage.set('recoveryCode', recoveryCode.toString()); 
      await this.storage.set('email', this.email); 
      
      const params = {
        to_name: this.email,    
        to_email: this.email,   
        code: recoveryCode,     
      };

      emailjs.send(
        'service_5qlhfug',  
        'template_awh6axa', 
        params,
        'wtGW6c3oM9cB1uzLS' 
      )
      .then((response) => {
        console.log('Correo enviado con éxito:', response);
        this.presentAlert('Correo enviado', 'Revisa tu bandeja de entrada para el código de recuperación.');
        this.router.navigate(['/rescontrasena']);
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        this.presentAlert('Error', 'Hubo un problema al enviar el correo. Inténtalo de nuevo más tarde.');
      });
    } else {
      await this.presentAlert('Correo no encontrado', 'El correo no está registrado en nuestra base de datos.');
    }
  }


  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return re.test(email);
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async ngOnInit() {
    await this.storage.create(); 
  }
}
