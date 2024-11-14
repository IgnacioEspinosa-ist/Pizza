import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-perfil-r',
  templateUrl: './perfil-r.page.html',
  styleUrls: ['./perfil-r.page.scss'],
})
export class PerfilRPage implements OnInit {
  imagen: string | null = null;
  id_user: number | null = null; 
  repartidorNombre: string = '';
  repartidorTelefono: string = '';

  editableCampos = {
    nombre: false,
    telefono: false
  };

  constructor(
    private dbService: DatabaseService, 
    private menu: MenuController, 
    private storage: Storage
  ) {}

  async ngOnInit() {
    // Inicializar Storage
    await this.storage.create();
    
    // Obtener id_user desde Storage
    const storedIdUser = await this.storage.get('id_user');
    if (storedIdUser) {
      this.id_user = storedIdUser;

      // Llamar a la base de datos solo si id_user es válido
      this.dbService.getUsuarioById(this.id_user!).subscribe({
        next: (usuario: any) => {
          this.repartidorNombre = usuario.nombre;
          this.repartidorTelefono = usuario.telefono;
        },
        error: (error: any) => {
          console.error('Error al cargar los datos del repartidor:', error);
        }
      });
    } else {
      console.error('No se encontró el id_user en Storage');
    }
  }

  activarEdicion(campo: 'nombre' | 'telefono') {
    this.editableCampos[campo] = true;
  }

  guardarCambios() {
    if (this.id_user) {
      this.dbService.updatePerfil(this.id_user, this.repartidorNombre, this.repartidorTelefono).subscribe({
        next: () => {
          console.log('Datos actualizados correctamente');
          
          this.editableCampos.nombre = false;
          this.editableCampos.telefono = false;
          
        },
        error: (error: any) => {
          console.error('Error al actualizar los datos del repartidor:', error);
          
        }
      });
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,  // Usamos DataUrl para obtener la imagen como cadena
      });
  
      // La imagen estará en image.dataUrl
      this.imagen = image.dataUrl ?? 'assets/perfil1.jpg'; // Si no hay imagen, usamos la predeterminada
  
      // Mostramos la imagen en la consola
      console.log("Imagen capturada:", this.imagen);
  
      // Ahora puedes guardar la imagen en la base de datos si es necesario
      await this.guardarFotoEnDB(this.imagen);
    } catch (error) {
      console.error("Error al tomar la foto:", error);
      this.imagen = 'assets/perfil1.jpg'; // Usamos la imagen predeterminada en caso de error
    }
  }
  
  
  async guardarFotoEnDB(foto: string) {
    try {
      if (this.id_user) {
        // Aquí estamos pasando la ruta de la imagen para que se guarde en la base de datos
        await this.dbService.updateUsuarioFoto(this.id_user, foto);
        console.log('Foto actualizada exitosamente');
      } else {
        console.error('id_user no encontrado para guardar la foto');
      }
    } catch (error) {
      console.error('Error al guardar la foto en la base de datos:', error);
    }
  }
  

  openMenuSecundario() {
    this.menu.open('menuSecundario');
  }
}
