import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from 'src/app/services/usuario'; // Asegúrate de que este modelo esté definido correctamente
import { ToastController } from '@ionic/angular/providers/toast-controller';

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
  apellido: string= '';
  rut: string= '';
  clave: string= '';
  
  newUser: Usuario = new Usuario();

  constructor(private dbService: DatabaseService,private toastCtrl: ToastController) { }

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

  addUsuario() {
    this.dbService.addUsuario(this.newUser).subscribe({
      next: async (res) => {
        const toast = await this.toastCtrl.create({
          message: 'Usuario creado exitosamente',
          duration: 2000,
          position: 'top',
        });
        toast.present();
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: 'Error al crear usuario: ' + err.message,
          duration: 2000,
          position: 'top',
        });
        toast.present();
      }
    });
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

