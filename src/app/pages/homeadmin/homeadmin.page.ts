import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Producto } from 'src/app/services/producto';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';


@Component({
  selector: 'app-admin',
  templateUrl: './homeadmin.page.html',
  styleUrls: ['./homeadmin.page.scss'],
})
export class AdminPage implements OnInit {
  productos: Producto[] = [];
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;
  stock: number = 0;
  imagen: string = '';
  productoActual: Producto | null = null; // Para gestionar la edición
  nuevoProducto: Producto  = new Producto ();

  constructor(private dbService: DatabaseService, private route: ActivatedRoute) {} // Asegúrate de inyectar ActivatedRoute aquí

  ngOnInit() {
    // Suscribirse al observable productos$
    this.dbService.productos$.subscribe((productos: Producto[]) => {
      this.productos = productos;
    });

    // Cargar los productos desde la base de datos
    this.dbService.fetchProductos(); // Llamada que actualiza el observable
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

  async eliminarProducto(id: number) {
    try {
      await this.dbService.deleteProducto(id);
      this.dbService.fetchProductos(); // Actualizar la lista de productos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }

  cargarDatosProducto(producto: Producto) {
    this.productoActual = producto;
    this.nombre = producto.nombre;
    this.precio = producto.precio;
    this.stock = producto.stock;
  }

  async modificarProducto() {
    if (!this.nombre || this.precio == null || this.stock == null) {
      console.warn('Todos los campos son obligatorios');
      return;
    }

    if (this.productoActual) {
      // Actualizar los valores del producto actual
      this.productoActual.nombre = this.nombre;
      this.productoActual.precio = this.precio;
      this.productoActual.stock = this.stock;

      try {
        await this.dbService.updateProducto(this.productoActual);
        this.limpiarCampos();
        this.dbService.fetchProductos(); // Actualizar la lista de productos
      } catch (error) {
        console.error("Error al modificar el producto:", error);
      }
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
    this.precio = 0;
    this.stock = 0;
    this.productoActual = null;
  }
}