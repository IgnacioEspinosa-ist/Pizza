// cambiar-contrasena.page.ts
import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage {
  newPassword: string = '';
  confirmPassword: string = '';
  email: string | null = null;

  constructor(private dbService: DatabaseService, private alertController: AlertController, private navCtrl: NavController, private storage: Storage) {}

  async ngOnInit() {
    this.email = await this.storage.get('email'); // Obtener el correo almacenado
  }

  async changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      await this.presentAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }
  
    if (this.newPassword.length < 8) {
      await this.presentAlert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }
  
    if (this.email) {
      this.dbService.updatePassword(this.email, this.newPassword).subscribe({
        next: async () => {
          await this.presentAlert('Éxito', 'Tu contraseña ha sido actualizada.');
          this.navCtrl.navigateRoot('/login'); // Redirigir al login
        },
        error: async (error) => {
          console.error('Error al actualizar la contraseña:', error);
          await this.presentAlert('Error', 'Hubo un problema al actualizar tu contraseña. Intenta nuevamente.');
        },
      });
    } else {
      await this.presentAlert('Error', 'No se encontró un correo válido para actualizar la contraseña.');
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
