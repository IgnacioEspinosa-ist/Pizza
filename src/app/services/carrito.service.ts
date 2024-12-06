
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: { [key: number]: Producto[] } = {}; // Objeto donde la clave es el id_user

  constructor(private storage: Storage) {}

  async obtenerProductos(): Promise<Producto[]> {
    const idUser = await this.storage.get('id_user');
    if (idUser && this.carrito[idUser]) {
      return this.carrito[idUser];
    }
    return [];
  }

  async agregarProducto(producto: Producto): Promise<void> {
    const idUser = await this.storage.get('id_user');
    if (!idUser) {
      console.error('No se encontró id_user en el almacenamiento.');
      return;
    }
    if (!this.carrito[idUser]) {
      this.carrito[idUser] = [];
    }
    this.carrito[idUser].push(producto);
  }

  async quitarProducto(id_prod: number): Promise<void> {
    const idUser = await this.storage.get('id_user');
    if (!idUser || !this.carrito[idUser]) {
      console.error('Carrito no encontrado para el usuario.');
      return;
    }
    this.carrito[idUser] = this.carrito[idUser].filter(p => p.id_prod !== id_prod);
  }

  async vaciarCarrito(): Promise<void> {
    const idUser = await this.storage.get('id_user');
    if (idUser) {
      this.carrito[idUser] = [];
    }
  }

  async actualizarCantidad(id_prod: number, nuevaCantidad: number): Promise<void> {
    const idUser = await this.storage.get('id_user');
    if (!idUser || !this.carrito[idUser]) {
      console.error('Carrito no encontrado para el usuario.');
      return;
    }
    const producto = this.carrito[idUser].find(p => p.id_prod === id_prod);
    if (producto) {
      producto.cantidad = nuevaCantidad;
    }
  }
}


/*import { Injectable } from '@angular/core';
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
}*/













