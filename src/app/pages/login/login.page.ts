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
     
      if (this.username === 'admin' && this.password === '1234') {
        
        this.navCtrl.navigateForward('/home');
      } else {
        
        alert('Invalid credentials');
      }
    } else {
      alert('Ingrese el Nombre y Contraseña Correcta');
    }
  }
}