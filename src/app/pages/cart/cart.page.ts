import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database.service';
import { Producto } from 'src/app/services/producto';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  carrito: Producto[] = [];
  productos: Producto[] = [];

  constructor(
    private alertController: AlertController,
    private dbService: DatabaseService,
    private storage: Storage,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.storage.create();

    // Cargar el carrito desde el Storage
    const storedCarrito = await this.storage.get('selectedProductId') || [];
    this.carrito = await this.dbService.getProductosByIds(storedCarrito);  // Supongamos que este método carga varios productos
  }

  async agregarProductoAlCarrito(producto: Producto) {
    const storedCarrito: number[] = await this.storage.get('selectedProductId') || [];

    // Verifica si el producto ya está en el carrito
    if (!storedCarrito.includes(producto.id_prod)) {
      storedCarrito.push(producto.id_prod);
    }

    // Actualiza el storage con el nuevo carrito
    await this.storage.set('selectedProductId', storedCarrito);
    await this.actualizarStorage();
  }

  async eliminarProductoDelCarrito(id_prod: number): Promise<void> {
    const storedCarrito: number[] = await this.storage.get('selectedProductId') || [];
    const index = storedCarrito.indexOf(id_prod);

    if (index !== -1) {
      storedCarrito.splice(index, 1);
      await this.storage.set('selectedProductId', storedCarrito);
      await this.actualizarStorage();
    }
  }

  async actualizarStorage() {
    // Actualizar la lista completa de productos en el carrito
    const storedCarrito = await this.storage.get('selectedProductId') || [];
    this.carrito = await this.dbService.getProductosByIds(storedCarrito);
  }

  obtenerTotalCarrito(): number {
    return this.carrito.reduce((total, producto) => total + producto.precio, 0);
  }
}
