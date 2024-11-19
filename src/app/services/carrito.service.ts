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
      // Si existe, incrementa la cantidad
      productoExistente.cantidad = (productoExistente.cantidad ?? 0) + 1;  // Usamos ?? 0 para asegurar que si cantidad es null o undefined, tome 0
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
        producto.cantidad = cantidad;  // Actualiza la cantidad
      } else {
        this.quitarProducto(id_prod);  // Si la cantidad es 0, elimina el producto
      }
      this.actualizarStorage();
    }
  }

  private async actualizarStorage() {
    await this.storage.set('carrito', this.carrito);
  }
}














/*import { Injectable } from '@angular/core';
import { Producto } from '../services/producto';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private cart: Producto[] = [];

  constructor() { }


  agregarProducto(producto: Producto): void {

    const existeProducto = this.cart.find(p => p.id_prod! === producto.id_prod!);
    if (existeProducto) {

      existeProducto.stock! += 1;
    } else {

      this.cart.push({ ...producto, stock: 1 });
    }
    console.log('Producto agregado:', producto);
    console.log('Carrito actual:', this.cart);
  }


  quitarProducto(id: number): void {
    this.cart = this.cart.filter(producto => producto.id_prod! !== id);
    console.log('Producto eliminado:', id);
    console.log('Carrito actual:', this.cart);
  }


  obtenerProductos(): Producto[] {
    return this.cart;
  }


  obtenerTotalProductos(): number {
    return this.cart.reduce((total, producto) => total + producto.stock!, 0);
  }


  vaciarCarrito(): void {
    this.cart = [];
    console.log('Carrito vacío');
  }
}
*/