import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from 'src/app/services/usuario'; // Asegúrate de que este modelo esté definido correctamente

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './administrador-usuario.page.html',
  styleUrls: ['./administrador-usuario.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = []; // Declarar la propiedad 'usuarios'
  nombre: string = '';
  telefono: any = '';
  email: string = '';
  id_roll: any = ''; // Puede ser 'repartidor', 'administrador', etc.
  usuarioActual: Usuario | null = null; // Para gestionar la edición
  apellido: string = '';
  rut: string = '';
  clave: string = '';

  newUser: Usuario = new Usuario();

  constructor(private dbService: DatabaseService, private alertController: AlertController) { }

  ngOnInit() {
    this.cargarUsuarios();
  }
  async cargarUsuarios() {
    this.dbService.fetchUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios; // Asignar los usuarios cargados
      },
      error: (error) => {
        console.error("Error al cargar los usuarios:", error);
      }
    });
  }
  //aqui para ver
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
  async addUsuario() {
    try {
      await this.dbService.insertUsuario(this.newUser); // Llama a la función insertUsuario
      // Muestra un alert cuando el usuario es creado exitosamente
      this.presentAlert('Éxito', 'Usuario creado exitosamente');
    } catch (err) {
      // Muestra un alert cuando ocurre un error
      this.presentAlert('Error', 'Error al crear usuario: ' + err);
    }
  }


  cargarDatosUsuario(usuario: Usuario) {
    this.usuarioActual = usuario;
    this.nombre = usuario.nombre;
    this.telefono = usuario.telefono;
    this.email = usuario.correo;
    this.id_roll = usuario.id_roll; // Carga el rol del usuario actual
  }

  async modificarUsuario() {
    if (!this.nombre || !this.telefono || !this.email || !this.id_roll || !this.apellido || !this.rut || !this.clave) {
      console.warn('Todos los campos son obligatorios');
      return;
    }

    if (this.usuarioActual) {
      this.usuarioActual.nombre = this.nombre;
      this.usuarioActual.apellido = this.apellido; // Modificar el apellido
      this.usuarioActual.rut = this.rut; // Modificar el RUT
      this.usuarioActual.correo = this.email;
      this.usuarioActual.clave = this.clave; // Modificar la clave
      this.usuarioActual.telefono = this.telefono;
      this.usuarioActual.id_roll = this.id_roll;

      try {
        await this.dbService.updateUsuario(this.usuarioActual);
        await this.cargarUsuarios();
        this.limpiarCampos();
      } catch (error) {
        console.error("Error al modificar el usuario:", error);
      }
    }
  }

  async eliminarUsuario(id: number) {
    try {
      await this.dbService.deleteUsuario(id); // Asegúrate de que este método esté en tu servicio
      await this.cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }


  limpiarCampos() {
    this.nombre = '';
    this.telefono = '';
    this.email = '';
    this.id_roll = ''; // Limpia el rol también
    this.usuarioActual = null;
  }
}

