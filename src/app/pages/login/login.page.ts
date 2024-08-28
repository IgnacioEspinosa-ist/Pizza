import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) {}

  login() {
    if (this.username && this.password) {
     
      if (this.username === 'donfitopaez' && this.password === 'mariposatecnicolor') {
        
        this.navCtrl.navigateForward('/home');
      } else {
        
        alert('Este Usuario No Existe, Revise Los Datos');
      }
    } else {
      alert('Ingrese el Nombre y Contraseña Correcta');
    }
  }
}