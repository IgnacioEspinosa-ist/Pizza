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
  id_user: number = 2; 
  repartidorNombre: string = '';
  repartidorTelefono: string = '';

  editableCampos = {
    nombre: false,
    telefono: false
  };

  constructor(private dbService: DatabaseService, private menu: MenuController) { }

  async ngOnInit() {
    

      
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


  activarEdicion(campo: 'nombre' | 'telefono') {
    this.editableCampos[campo] = true;
  }

  
  guardarCambios() {
    if (this.id_user) {
      this.dbService.updatePerfil(this.id_user,this.repartidorNombre, this.repartidorTelefono).subscribe({
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
