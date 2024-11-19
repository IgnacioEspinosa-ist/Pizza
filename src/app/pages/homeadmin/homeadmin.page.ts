import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Producto } from 'src/app/services/producto';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-admin',
  templateUrl: './homeadmin.page.html',
  styleUrls: ['./homeadmin.page.scss'],
})
export class AdminPage implements OnInit {
  productos: Producto[] = [];
  productoActual: Producto | null = null;
  nuevoProducto: Producto = new Producto();

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.productos$.subscribe((productos: Producto[]) => {
      this.productos = productos;
    });

    // Cargar los productos desde la base de datos
    this.dbService.fetchProductos(); // Actualizar la lista de productos
  }

  async agregarProducto() {
    try {
      await this.dbService.insertProducto(this.nuevoProducto);
      this.limpiarCampos(); // Limpiar los campos después de agregar
      this.dbService.fetchProductos(); // Actualizar la lista de productos
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  async modificarProducto() {
    if (!this.nuevoProducto.nombre || this.nuevoProducto.precio == null || this.nuevoProducto.stock == null) {
      console.warn('Todos los campos son obligatorios');
      return;
    }
  
    if (this.productoActual) {
      this.productoActual.nombre = this.nuevoProducto.nombre;
      this.productoActual.descripcion = this.nuevoProducto.descripcion;
      this.productoActual.precio = this.nuevoProducto.precio;
      this.productoActual.stock = this.nuevoProducto.stock;
      this.productoActual.foto = this.nuevoProducto.foto;
  
      try {
        await this.dbService.updateProducto(this.productoActual);
        console.log("Producto actualizado correctamente");
  
        // Limpiar campos y refrescar la lista
        this.limpiarCampos();
        this.dbService.fetchProductos(); // Actualizar la lista de productos
      } catch (error) {
        console.error("Error al modificar el producto:", error);
      }
    }
  }
  
  
  

  ionViewWillEnter() {
    this.dbService.fetchProductos();
  }
  
  

  cargarDatosProducto(producto: Producto) {
    this.productoActual = producto;
    this.nuevoProducto = { ...producto }; // Copiar los datos del producto seleccionado a nuevoProducto
  }

  async eliminarProducto(id: number) {
    try {
      await this.dbService.deleteProducto(id);
      this.dbService.fetchProductos(); // Actualizar la lista de productos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    this.nuevoProducto.foto = image.webPath ?? 'assets/perfil1.jpg'; // Guardar la URL de la imagen en nuevoProducto
  }

  limpiarCampos() {
    this.nuevoProducto = new Producto();
    this.productoActual = null;
  }
}
