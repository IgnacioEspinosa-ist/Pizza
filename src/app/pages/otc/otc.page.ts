import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import emailjs from 'emailjs-com';  // Importar EmailJS
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otc',
  templateUrl: './otc.page.html',
  styleUrls: ['./otc.page.scss'],
})
export class OtcPage implements OnInit {

  email: string = '';  // Variable para almacenar el correo ingresado por el usuario

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
      const recoveryCode = Math.floor(100000 + Math.random() * 900000); // Código aleatorio
      await this.storage.set('recoveryCode', recoveryCode.toString()); // Guardar el código
      await this.storage.set('email', this.email); // Guardar el correo
      
      const params = {
        to_name: this.email,    // Correo del destinatario
        to_email: this.email,   // Dirección de correo del destinatario
        code: recoveryCode,     // Código de recuperación generado
      };

      emailjs.send(
        'service_5qlhfug',  // Tu Service ID
        'template_awh6axa', // Tu Template ID
        params,
        'wtGW6c3oM9cB1uzLS' // Tu Public Key (User ID)
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

  // Método para validar el formato del correo
  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validar formato de correo
    return re.test(email);
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

  async ngOnInit() {
    await this.storage.create(); // Asegúrate de inicializar el Storage
  }
}
