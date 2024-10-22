import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { Producto } from '../services/producto';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  productos: Producto[] = [];

  constructor(
    private router: Router, 
    private menu: MenuController, 
    private dbService: DatabaseService,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create(); 
    // Suscribirse al observable de productos
    this.dbService.productos$.subscribe((data: Producto[]) => {
      this.productos = data;
    });

    // Llamar al método para obtener los productos
    this.dbService.fetchProductos();
  }

  async verDetalleProducto(producto: Producto) {
    // Almacenar el id del producto en Storage
    try {
      const arregloProductos = await this.storage.get('selectedProductId');
      arregloProductos.push(producto.id_prod)
      await this.storage.set('selectedProductId', arregloProductos);
    } catch (error) {
      const arregloProductos = [producto.id_prod]
      await this.storage.set('selectedProductId', arregloProductos);
    }
    

    // Navegar a la página de detalle del producto
    this.router.navigate(['/detalle-producto']);
  }
}
