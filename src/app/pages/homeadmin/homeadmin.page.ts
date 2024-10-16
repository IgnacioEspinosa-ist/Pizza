import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Producto } from 'src/app/services/producto';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  productos: Producto[] = [];
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;
  stock: number = 0;
  productoActual: Producto | null = null; // Para gestionar la edición

  constructor(private dbService: DatabaseService) { }

  ngOnInit() {
    // Suscribirse al observable productos$
    this.dbService.productos$.subscribe((productos: Producto[]) => {
      this.productos = productos;
    });

    // Cargar los productos desde la base de datos
    this.dbService.fetchProductos(); // Llamada que actualiza el observable
  }

  async agregarProducto() {
    if (!this.nombre || !this.descripcion || this.precio == null || this.stock == null) {
      console.warn('Todos los campos son obligatorios');
      return;
    }

    const nuevoProducto: Producto = {
      id_prod: 0,
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio: this.precio,
      stock: this.stock,
    };

    try {
      await this.dbService.insertProducto(nuevoProducto);
      this.limpiarCampos();  // Limpiar los campos después de agregar
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  async eliminarProducto(id: number) {
    try {
      await this.dbService.deleteProducto(id);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  }

  cargarDatosProducto(producto: Producto) {
    this.productoActual = producto;
    this.nombre = producto.nombre;
    this.descripcion = producto.descripcion;
    this.precio = producto.precio;
    this.stock = producto.stock;
  }

  async modificarProducto() {
    if (!this.nombre || !this.descripcion || this.precio == null || this.stock == null) {
      console.warn('Todos los campos son obligatorios');
      return;
    }

    if (this.productoActual) {
      this.productoActual.nombre = this.nombre;
      this.productoActual.descripcion = this.descripcion;
      this.productoActual.precio = this.precio;
      this.productoActual.stock = this.stock;

      try {
        await this.dbService.updateProducto(this.productoActual);
        this.limpiarCampos();
      } catch (error) {
        console.error("Error al modificar el producto:", error);
      }
    }
  }

  limpiarCampos() {
    this.nombre = '';
    this.descripcion = '';
    this.precio = 0;
    this.stock = 0;
    this.productoActual = null;
  }
}
