import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from 'src/app/services/usuario'; 
import { Camera, CameraResultType } from '@capacitor/camera';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './administrador-usuario.page.html',
  styleUrls: ['./administrador-usuario.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = []; 
  nombre: string = '';
  telefono!: string  // Cambiar tipo a string
  email: string = '';
  id_roll: number = 0 ; // Cambiar a tipo number o null
  usuarioActual: Usuario | null = null; 
  apellido: string = '';
  rut: string = '';
  clave: string = '';
  
  newUser: Usuario = new Usuario();
  imagen: string = ''; // Variable para almacenar la foto

  constructor(private dbService: DatabaseService, private alertController: AlertController) {
    
   }

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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async addUsuario() {
    // Asegúrate de asignar las propiedades nuevas al nuevo usuario
    this.newUser.telefono = this.telefono;
    this.newUser.id_roll = this.id_roll;
    this.newUser.foto = this.imagen; // Asignar la foto

    try {
      await this.dbService.insertUsuario(this.newUser); // Llama a la función insertUsuario
      this.presentAlert('Éxito', 'Usuario creado exitosamente');
      this.limpiarCampos(); // Limpiar campos después de crear el usuario
    } catch (err) {
      this.presentAlert('Error', 'Error al crear usuario: ' + err);
    }
  }

  cargarDatosUsuario(usuario: Usuario) {
    this.usuarioActual = usuario;
    this.nombre = usuario.nombre;
    this.telefono = usuario.telefono|| ' ';
    this.email = usuario.correo;
    this.id_roll = usuario.id_roll|| 0; // Carga el rol del usuario actual
    this.imagen = usuario.foto || ''; // Cargar la foto del usuario actual si existe
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
      this.usuarioActual.foto = this.imagen; // Actualizar la foto si se ha cambiado

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

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    this.imagen = image.webPath ?? 'assets/perfil1.jpg'; // Guardar la foto en una variable

    // Si deseas actualizar la vista inmediatamente, puedes usar un método para hacerlo
  }

  limpiarCampos() {
    this.nombre = '';
    this.telefono = '';
    this.email = '';
    this.id_roll = 0; // Cambiar a null
    this.usuarioActual = null;
    this.imagen = ''; // Limpiar imagen
  }
}
