import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-perfil-r',
  templateUrl: './perfil-r.page.html',
  styleUrls: ['./perfil-r.page.scss'],
})
export class PerfilRPage implements OnInit {
  imagen: string | null = null;
  id_user: number = 2; // ID del repartidor (asegúrate de tener el ID correcto)
  repartidorNombre: string = '';
  repartidorTelefono: string = '';

  editableCampos = {
    nombre: false,
    telefono: false
  };

  constructor(private dbService: DatabaseService, private menu: MenuController) { }

  async ngOnInit() {
    

      // Cargar los datos del repartidor
      this.dbService.getUsuarioById(this.id_user).subscribe({
        next: (usuario: any) => {
          this.repartidorNombre = usuario.nombre;
          this.repartidorTelefono = usuario.telefono;
        },
        error: (error: any) => {
          console.error('Error al cargar los datos del repartidor:', error);
        }
      });
    
  }

  // Activar o desactivar la edición de los campos
  activarEdicion(campo: 'nombre' | 'telefono') {
    this.editableCampos[campo] = true;
  }

  // Método para guardar los cambios en la base de datos
  guardarCambios() {
    if (this.id_user) {
      this.dbService.updatePerfil(this.id_user,this.repartidorNombre, this.repartidorTelefono).subscribe({
        next: () => {
          console.log('Datos actualizados correctamente');
          // Desactivar la edición después de guardar
          this.editableCampos.nombre = false;
          this.editableCampos.telefono = false;
          // Opcional: agregar una alerta o mensaje de éxito
        },
        error: (error: any) => {
          console.error('Error al actualizar los datos del repartidor:', error);
          // Opcional: manejar el error y mostrar un mensaje al usuario
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

  openMenuSecundario() {
    this.menu.open('menuSecundario');
  }
}
