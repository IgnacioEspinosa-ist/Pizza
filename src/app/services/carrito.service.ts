import { Injectable } from '@angular/core';
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
