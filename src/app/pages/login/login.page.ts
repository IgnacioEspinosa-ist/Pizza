import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service'; // Importar tu servicio de base de datos
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private navCtrl: NavController, private dbService: DatabaseService, private storage: Storage) {
    this.initStorage();
  }
  
  async initStorage() {
    await this.storage.create(); // Asegura la inicialización completa
  }

  async login() {
    if (this.username && this.password) {
      try {
        const usuarioValido = await this.dbService.validarUsuario(this.username, this.password);
        if (usuarioValido) {
          await this.storage.set('id_user', usuarioValido.id_user); // Guardar el ID del usuario en Storage
  
          await Haptics.impact({ style: ImpactStyle.Medium });
  
          // Redirigir según el id_roll del usuario
          if (usuarioValido.id_roll === 1) {
            this.navCtrl.navigateForward('/home');
          } else if (usuarioValido.id_roll === 2) {
            this.navCtrl.navigateForward('/homerepa');
          } else if (usuarioValido.id_roll === 3) {
            this.navCtrl.navigateForward('/admin');
          }
        } else {
          alert('Este Usuario No Existe, Revise Los Datos');
        }
      } catch (error) {
        console.error("Error durante el proceso de login:", error);
        alert('Hubo un problema al verificar el usuario.');
      }
    } else {
      alert('Ingrese el Nombre y Contraseña Correcta');
    }
  }
  
  
}
