import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service'; // Importar tu servicio de base de datos
import { Haptics, ImpactStyle } from '@capacitor/haptics';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private navCtrl: NavController, private dbService: DatabaseService) {}

  async login() {
    if (this.username && this.password) {
      try {
        const usuarioValido = await this.dbService.validarUsuario(this.username, this.password);
        if (usuarioValido) {

          await Haptics.impact({ style: ImpactStyle.Medium }); //vibra al iniciar sesion

          if (usuarioValido.id_roll === 1) {
            this.navCtrl.navigateForward('/home'); // Navegar al dashboard del usuario regular
          } else if (usuarioValido.id_roll === 2) {
            this.navCtrl.navigateForward('/homerepa'); // Navegar al dashboard del repartidor
          }else if (usuarioValido.id_roll === 3) {
            this.navCtrl.navigateForward('/homeadmin'); // Navegar al dashboard del repartidor
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
