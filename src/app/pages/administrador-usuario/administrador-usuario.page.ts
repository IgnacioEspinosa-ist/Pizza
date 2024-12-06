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
  telefono!: string 
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
    this.dbService.fetchRepartidores().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios; 
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
    // Validar que los campos obligatorios no estén vacíos
    if (!this.nombre || !this.telefono || !this.email || !this.id_roll || !this.apellido || !this.rut || !this.clave) {
      this.presentAlert('Error', 'Todos los campos son obligatorios');
      return;
    }
  
    // Si pasa la validación, entonces crear el usuario
    try {
      await this.dbService.insertUsuario(this.newUser);
      this.presentAlert('Éxito', 'Usuario creado exitosamente');
      await this.cargarUsuarios();
    } catch (err) {
      this.presentAlert('Error', 'Error al crear usuario: ' + err);
    }
  }
  

  cargarDatosUsuario(usuario: Usuario) {
    this.usuarioActual = usuario;
    this.nombre = usuario.nombre;
    this.telefono = usuario.telefono || ' ';
    this.email = usuario.correo;
    this.id_roll = usuario.id_roll || 0; // Carga el rol del usuario actual
    this.imagen = usuario.foto || ''; // Cargar la foto del usuario actual si existe
  }

  async modificarUsuario() {
    if (!this.nombre || !this.telefono || !this.email || !this.id_roll || !this.apellido || !this.rut || !this.clave) {
      console.warn('Todos los campos son obligatorios');
      return;
    }

    if (this.usuarioActual) {
      console.log(this.usuarioActual); // Verificar usuario actual

      if (!this.usuarioActual.id_user) {
        console.warn('ID de usuario no válido');
        return;
      }

      this.usuarioActual.nombre = this.nombre;
      this.usuarioActual.apellido = this.apellido;
      this.usuarioActual.rut = this.rut;
      this.usuarioActual.correo = this.email;
      this.usuarioActual.clave = this.clave;
      this.usuarioActual.telefono = this.telefono;
      this.usuarioActual.foto = this.imagen;

      try {
        await this.dbService.updateUsuario(this.usuarioActual);
        await this.cargarUsuarios();

      } catch (error) {
        console.error("Error al modificar el usuario:", error);
      }
    }
  }


  async eliminarUsuario(id: number) {
    try {
      await this.dbService.deleteUsuario(id); 
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

    this.imagen = image.webPath ?? 'assets/perfil1.jpg'; 

   
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
