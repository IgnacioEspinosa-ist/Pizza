import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from 'src/app/services/database.service'; 
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cambiocon',
  templateUrl: './cambiocon.page.html',
  styleUrls: ['./cambiocon.page.scss'],
})
export class CambioconPage  {

  ngOnInit() {
  }

  registerUser = {
    clave: '',
    repeatedClave: ''
  };
  id_user: number | null = null;
  passwordsMatch = true;
  passwordChecked = false;

  constructor(
    private storage: Storage,
    private dbService: DatabaseService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.loadUserId();
  }

  async loadUserId() {
    this.id_user = await this.storage.get('id_user');
  }
  async onVerifyPassword() {
    this.passwordChecked = true;

    if (this.registerUser.clave !== this.registerUser.repeatedClave) {
      this.passwordsMatch = false;
      const toast = await this.toastController.create({
        message: 'Las contraseñas no coinciden.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    if (this.id_user) {
      try {
        const storedPassword = await this.dbService.getPassword(this.id_user);
        if (this.registerUser.clave === storedPassword) {
          this.passwordsMatch = true;
          const toast = await this.toastController.create({
            message: 'Contraseña correcta. Redirigiendo...',
            duration: 2000,
            color: 'success',
          });
          await toast.present();

          const email = await this.dbService.getEmail(this.id_user);
          if (email) {
           
            await this.storage.set('email', email);
          }
     
          this.router.navigate(['/cambiar-contrasena']);
        } else {
          this.passwordsMatch = false;
          const toast = await this.toastController.create({
            message: 'La contraseña no coincide.',
            duration: 2000,
            color: 'danger',
          });
          await toast.present();
        }
      } catch (error) {
        const toast = await this.toastController.create({
          message: 'Error al verificar la contraseña.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      }
    } else {
      const toast = await this.toastController.create({
        message: 'No se encontró el ID del usuario.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}

 