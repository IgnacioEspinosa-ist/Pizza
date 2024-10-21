import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  imagen: string | null = null; // Inicializa la imagen como null
  id_user: number = 1; // ID del usuario actual
  usuario: any = {}; // Objeto para almacenar los datos del usuario
  editableCampos = {
    nombre: false,
    apellido: false,
    telefono: false,
    rut: false
  };

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    // Cargar los datos del usuario al inicializar el componente
    this.dbService.getUsuarioById(this.id_user).subscribe({
      next: (usuario: any) => {
        this.usuario = usuario; // Asignar el usuario a la propiedad
        this.imagen = usuario.foto; // Establecer la imagen del usuario
      },
      error: (error: any) => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    });
  }

  // Activar o desactivar la edición de los campos
  activarEdicion(campo: 'nombre' | 'apellido' | 'telefono' | 'rut') {
    this.editableCampos[campo] = true;
  }

  // Método para guardar los cambios en la base de datos
  guardarCambios(campo: 'nombre' | 'apellido' | 'telefono' | 'rut') {
    if (this.id_user) {
      // Llamar al método updatePerfil con los datos actuales del usuario
      this.dbService.updatePerfilU(
        this.id_user,
        this.usuario.nombre,
        this.usuario.apellido,
        this.usuario.telefono,
        this.usuario.rut
      ).subscribe({
        next: () => {
          console.log(`Campo ${campo} actualizado correctamente`);
          // Desactivar la edición del campo específico
          this.editableCampos[campo] = false;
        },
        error: (error: any) => {
          console.error(`Error al actualizar el campo ${campo}:`, error);
        }
      });
    }
  }
  

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    this.imagen = image.webPath ?? 'assets/perfil1.jpg';

    if (image.path) {
      await this.guardarFotoEnDB(image.path);
    }
  }

  async guardarFotoEnDB(foto: string) {
    try {
      await this.dbService.updateUsuarioFoto(this.id_user, foto);
      console.log('Foto actualizada exitosamente');
    } catch (error) {
      console.error('Error al guardar la foto en la base de datos:', error);
    }
  }
}
