
import { Injectable } from '@angular/core';
import { Producto } from './producto';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: Producto[] = [];

  constructor(private storage: Storage) {}

  async cargarCarrito() {
    const carrito = await this.storage.get('carrito');
    this.carrito = carrito || [];
  }

  obtenerProductos(): Producto[] {
    return this.carrito;
  }

  agregarProducto(producto: Producto) {
    const productoExistente = this.carrito.find(prod => prod.id_prod === producto.id_prod);
  
    if (productoExistente) {
   
      productoExistente.cantidad = (productoExistente.cantidad ?? 0) + 1;  
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
  
    this.actualizarStorage();
  }
  

  quitarProducto(id_prod: number) {
    const index = this.carrito.findIndex(prod => prod.id_prod === id_prod);
    if (index !== -1) {
      this.carrito.splice(index, 1);
      this.actualizarStorage();
    }
  }

  vaciarCarrito() {
    this.carrito = [];
    this.actualizarStorage();
  }

  actualizarCantidad(id_prod: number, cantidad: number) {
    const producto = this.carrito.find(prod => prod.id_prod === id_prod);
    if (producto) {
      if (cantidad > 0) {
        producto.cantidad = cantidad; 
      } else {
        this.quitarProducto(id_prod);  
      }
      this.actualizarStorage();
    }
  }

  private async actualizarStorage() {
    await this.storage.set('carrito', this.carrito);
  }

  async logout() {
    // Eliminar el id_user del almacenamiento
    await this.storage.remove('id_user');

    // Vaciar el carrito
    this.vaciarCarrito();

    console.log('Sesión cerrada y carrito vaciado.');
  }
}

