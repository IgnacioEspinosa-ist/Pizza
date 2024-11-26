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
  repartidorApellido: string = ''; 
  repartidorTelefono: string = '';
  repartidorRut: string = ''; 

  editableCampos = {
    nombre: false,
    apellido: false, 
    telefono: false,
    rut: false, 
  };

  constructor(
    private dbService: DatabaseService,
    private menu: MenuController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    try {
      // Inicializar Storage
      await this.storage.create();

      // Obtener id_user desde Storage
      const storedIdUser = await this.storage.get('id_user');
      if (storedIdUser) {
        this.id_user = storedIdUser;

        // Cargar datos del repartidor
        this.dbService.getUsuarioById(this.id_user!).subscribe({
          next: async (usuario: any) => {
            this.repartidorNombre = usuario.nombre;
            this.repartidorApellido = usuario.apellido; 
            this.repartidorTelefono = usuario.telefono;
            this.repartidorRut = usuario.rut; 

           
            try {
              const foto = await this.dbService.getUsuarioFoto(this.id_user!);
              this.imagen = foto || 'assets/perfil1.jpg'; 
            } catch (error) {
              console.error('Error al cargar la foto del repartidor:', error);
              this.imagen = 'assets/perfil1.jpg'; 
            }
          },
          error: (error: any) => {
            console.error('Error al cargar los datos del repartidor:', error);
          },
        });
      } else {
        console.error('No se encontró el id_user en Storage');
      }
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }

  activarEdicion(campo: 'nombre' | 'apellido' | 'telefono' | 'rut') {
    this.editableCampos[campo] = true;
  }

  guardarCambios() {
    if (this.id_user) {
      this.dbService.updatePerfil(this.id_user, this.repartidorNombre, this.repartidorApellido, this.repartidorTelefono, this.repartidorRut).subscribe({
        next: () => {
          console.log('Datos actualizados correctamente');
          this.editableCampos.nombre = false;
          this.editableCampos.apellido = false;
          this.editableCampos.telefono = false;
          this.editableCampos.rut = false;
        },
        error: (error: any) => {
          console.error('Error al actualizar los datos del repartidor:', error);
        },
      });
    }
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri, 
      });

    
      this.imagen = image.webPath ?? 'assets/perfil1.jpg';

      await this.guardarFotoEnDB(this.imagen);
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  async guardarFotoEnDB(foto: string) {
    try {
      if (this.id_user) {
      
        await this.dbService.insertUsuarioFoto(this.id_user, foto);
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
