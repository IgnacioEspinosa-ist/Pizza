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
      // Aquí iría la llamada al servicio para validar las credenciales.
      // Pero por ahora validamos de manera fija.
      if (this.username === 'admin' && this.password === '1234') {
        // Login exitoso, redirigir a la página principal.
        this.navCtrl.navigateForward('/home');
      } else {
        // Mostrar mensaje de error
        alert('Invalid credentials');
      }
    } else {
      alert('Please enter both username and password');
    }
  }
}