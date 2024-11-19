import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerUser = {
    nombre: '',
    apellido: '',
    rut: '',
    correo: '',
    clave: '',
    repeatedClave: '',  // Campo para repetir la clave
    telefono: '',
  };

  constructor(
    private dbService: DatabaseService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  async registerUserAction() {
    // Validación de contraseñas
    if (this.registerUser.clave !== this.registerUser.repeatedClave) {
      await this.presentAlert('Las contraseñas no coinciden.');
      return;
    }

    // Validaciones generales antes de guardar
    if (
      !this.registerUser.nombre ||
      !this.registerUser.apellido ||
      !this.registerUser.rut ||
      !this.registerUser.correo ||
      !this.registerUser.clave ||
      !this.registerUser.telefono
    ) {
      await this.presentAlert('Todos los campos son obligatorios.');
      return;
    }

    // Inserta el usuario con rol por defecto
    const nuevoUsuario = {
      nombre: this.registerUser.nombre,
      apellido: this.registerUser.apellido,
      rut: this.registerUser.rut,
      correo: this.registerUser.correo,
      clave: this.registerUser.clave,
      telefono: this.registerUser.telefono,
      id_roll: 1, // Cliente por defecto
      foto: null, // Foto opcional
    };

    try {
      await this.dbService.insertUsuarioU(nuevoUsuario);
      await this.presentAlert('Usuario registrado con éxito.');
      this.navCtrl.navigateBack('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      await this.presentAlert('Error al registrar usuario.');
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Registro',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
