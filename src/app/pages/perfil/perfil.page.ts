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
  id_user: number = 1; // Establece el ID del usuario actual

  constructor(private dbService: DatabaseService) { }

  ngOnInit() {
    // Cargar la foto del usuario al inicializar el componente
    this.dbService.getFotoUsuario(this.id_user).subscribe({
        next: (foto: string | null) => {
            this.imagen = foto ? foto : 'assets/perfil1.jpg'; // Establece la foto o una predeterminada
        },
        error: (error: any) => {
            console.error("Error al cargar la foto:", error);
            this.imagen = 'assets/perfil1.jpg'; // Establece la foto predeterminada en caso de error
        }
    });}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri // Usar URI para mostrar la imagen
    });

    // Establecer la nueva imagen
    this.imagen = image.webPath??'assets/perfil1.jpg';

    // Guarda la nueva imagen en la base de datos
    if (image.path) {
      await this.guardarFotoEnDB(image.path); // Guardar en la base de datos
    }
  }

  async guardarFotoEnDB(foto: string) {
    try {
      await this.dbService.updateUsuarioFoto(this.id_user, foto); // Implementa este método en el servicio
      console.log("Foto actualizada exitosamente");
    } catch (error) {
      console.error("Error al guardar la foto en la base de datos:", error);
    }
  }
}