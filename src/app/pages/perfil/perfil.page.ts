import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DatabaseService } from 'src/app/services/database.service';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  imagen!: any 
  id_user: number | null = null; // Inicialmente nulo hasta que se obtenga del Storage
  usuario: any = {}; // Almacena los datos del usuario
  editableCampos = {
    nombre: false,
    apellido: false,
    telefono: false,
    rut: false
  };

  constructor(private dbService: DatabaseService, private storage: Storage, private toastController: ToastController) {}

  async ngOnInit() {
    try {
      // Inicializar Storage
      await this.storage.create();
  
      // Obtener id_user desde Storage
      const storedIdUser = await this.storage.get('id_user');
      if (storedIdUser) {
        this.id_user = storedIdUser;
  
        // Llamar a la base de datos para cargar los datos del usuario
        this.dbService.getUsuarioById(this.id_user!).subscribe({
          next: async (usuario: any) => {
            this.usuario = usuario;
  
            // Intentar cargar la foto del usuario desde la base de datos
            try {
              const foto = await this.dbService.getUsuarioFoto(this.id_user!);
              this.imagen = foto || 'assets/perfil1.jpg'; // Usar foto o imagen predeterminada
            } catch (error) {
              console.error('Error al cargar la foto del usuario:', error);
              this.imagen = 'assets/perfil1.jpg'; // Usar imagen predeterminada en caso de error
            }
          },
          error: (error: any) => {
            console.error('Error al cargar los datos del usuario:', error);
          }
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

  guardarCambios(campo: 'nombre' | 'telefono' | 'rut') {
    if (this.id_user) {
      this.dbService
        .updatePerfilU(
          this.id_user,
          this.usuario.nombre,
          this.usuario.apellido,
          this.usuario.telefono,
          this.usuario.rut
        )
        .subscribe({
          next: () => {
            console.log('Datos actualizados correctamente');
  
            // Desactivar la edición para todos los campos
            this.editableCampos.nombre = false;
            this.editableCampos.apellido = false;
            this.editableCampos.telefono = false;
            this.editableCampos.rut = false;
          },
          error: (error: any) => {
            console.error('Error al actualizar los datos del usuario:', error);
          }
        });
    }
  }

  async confirmarCambios() {
    // Lógica para actualizar los datos del usuario (esto puede incluir la base de datos o algún otro servicio)
    console.log('Cambios confirmados:', this.usuario);

    // Mostrar el mensaje de confirmación
    const toast = await this.toastController.create({
      message: 'Los cambios se han guardado correctamente.',
      duration: 2000,  // Duración en milisegundos (2 segundos)
      position: 'bottom',  // Posición del mensaje en la pantalla
    });
    toast.present();
  }
  

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,  // Usamos Uri para obtener la URL de la imagen
    });
  
    // Asignamos la URL obtenida como la imagen del usuario
    this.imagen = image.webPath ?? 'assets/perfil1.jpg';  // Usa la URL de la imagen o una por defecto
  
    // Llamamos a la función para actualizar la foto del usuario en la base de datos
    await this.dbService.insertUsuarioFoto(this.id_user!, this.imagen);
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
}
