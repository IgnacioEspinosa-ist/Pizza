import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service'; 
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
    await this.storage.create(); 
  }

  async login() {
   
    if (!this.username || !this.password) {
      alert('Ingrese el Nombre y Contraseña Correcta');
      return;
    }
  
  
    if (this.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }
  
    try {
      
      const usernameTrimmed = this.username.trim().toLowerCase();
  
      
      const usuarioValido = await this.dbService.validarUsuario(usernameTrimmed, this.password);
      if (usuarioValido) {
        await this.storage.set('id_user', usuarioValido.id_user); 
  
        await Haptics.impact({ style: ImpactStyle.Medium });
  
      
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
      console.error('Error durante el proceso de login:', error);
      alert('Hubo un problema al verificar el usuario.');
    }
  }
  
  
}
