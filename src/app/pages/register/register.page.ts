import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
 
  email: string = '';
  rut: string = '';
  password: string = '';
  esDelivery: boolean = false;
  passwordMismatchError: string = '';

 
  emailError: string = '';
  rutError: string = '';
  passwordError: string = '';
  confirmPassword: string ='';

  constructor(private alertController: AlertController,private router: Router) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se Ha Registrado Correctamente',
      buttons: ['Entendido'],
      
    });

 
    

    await alert.present();
  }

  async register() {
    
    this.emailError = '';
    this.rutError = '';
    this.passwordError = '';
    this.confirmPassword ='';
    

    
    if (!this.email) {
      this.emailError = 'El correo es requerido.';
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.email)) {
      this.emailError = 'Correo inválido.';
    }

   
    if (!this.rut) {
      this.rutError = 'El RUT es requerido.';
    } else if (!/^\d{1,2}\d{3}\d{3}[-]{1}[0-9kK]{1}$/.test(this.rut)) {
      this.rutError = 'Formato de RUT inválido. Solo números y guion son permitidos.';
    }

    
    if (!this.password) {
      this.passwordError = 'La contraseña es requerida.';
    } else if (this.password.length < 8) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres.';
    }

    if (this.password !== this.confirmPassword) {
      this.passwordMismatchError = 'Las contraseñas no coinciden';
      return;
    }

    
    if (!this.emailError && !this.rutError && !this.passwordError) {
      console.log('Formulario válido:', { email: this.email, rut: this.rut, password: this.password });
      await this.presentAlert();
      this.router.navigate(['/login']);
      
    } else {
      console.log('Formulario inválido');
    }

    
  }
}
