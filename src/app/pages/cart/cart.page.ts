import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CarritoService } from 'src/app/services/carrito.service';
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
  productos: Producto[] = [];
  totalCarrito: number = 0;
  totalFormateado: string = '';
  correoUsuario: string | null = null;
 
  commerceOrder = this.generarCommerceOrder();
  constructor(
    private dbService: DatabaseService,
    private carritoService: CarritoService,
    private alertController: AlertController,
    private storage: Storage,
    private router: Router,
    
  ) { }

  async ngOnInit() {
    
    const idUser = await this.storage.get('id_user');
  
    this.emailConseguir()
    if (!idUser) {
      console.error('No se encontró id_user en el almacenamiento.');
      return;
    }
    this.productos = await this.carritoService.obtenerProductos();
    this.calcularTotal();
  }




  actualizarCarrito() {
    this.productos = this.carritoService.obtenerProductos();
    this.calcularTotal();
  }

  async emailConseguir() {
    const id_user = await this.storage.get('id_user');
    try {
      this.correoUsuario = await this.dbService.getEmail(id_user);
    }
    catch (error) {
      console.error('Error al obtener el correo:', error);
    }
  };


  async eliminarProductoDelCarrito(id_prod: number): Promise<void> {
    try {
      this.carritoService.quitarProducto(id_prod);
      this.actualizarCarrito();
      const alert = await this.alertController.create({
        header: 'Producto Eliminado',
        message: 'El producto ha sido eliminado del carrito.',
        buttons: ['Entendido']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: `Ocurrió un error: ${error}`,
        buttons: ['Entendido']
      });
      await alert.present();
    }
  }


  calcularTotal(): void {

    const total = this.productos.reduce((suma, producto) =>
      suma + (producto.precio * (producto.cantidad || 0)),
      0
    );


    this.totalCarrito = total;


    this.totalFormateado = total.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
    });
  }



  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
    this.actualizarCarrito();
  }
/*
  linkpago() {
    this.carritoService.obtenerLinkPago().subscribe({
      next: (linkPago) => {
        console.log('Link de pago:', linkPago);
        window.open(linkPago, '_blank');  // abre el link en nueva pestaña

        this.vaciarCarrito();
      },
      error: (err) => {
        console.error('Error al obtener link de pago:', err);
        // Mostrar mensaje de error al usuario si quieres
      }
    });
  }*/

  async finalizarCompra() {
    if (!this.productos || this.productos.length === 0) {
      console.error('El carrito está vacío, no se puede finalizar la compra.');
      return;
    }

    try {
      const idUser = await this.storage.get('id_user');
      if (!idUser) {
        console.error('No se pudo obtener el id_user del almacenamiento.');
        return;
      }

      // Chequeo de stock para cada producto
      for (const producto of this.productos) {
        if (producto.cantidad && producto.stock !== undefined) {
          if (producto.cantidad > producto.stock) {
            const alert = await this.alertController.create({
              header: 'Stock insuficiente',
              message: `El producto "${producto.nombre}" no tiene suficiente stock. Disponible: ${producto.stock}.`,
              buttons: ['Entendido'],
            });
            await alert.present();
            return; // Detiene la ejecución si algún producto no tiene stock suficiente
          }
        }
      }

/*
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localDateTime = new Date(now.getTime() - offset).toISOString().slice(0, 19).replace('T', ' ');

      const nuevoPedido = {
        f_pedido: localDateTime,
        id_user: idUser,
        id_direccion: 1,
        total: this.totalCarrito,
        id_user_resp: undefined,
        estatus: 'pendiente'
      };*/

      
      const subject = this.generarSubject(this.productos);
      

      const body = {
        amount: this.totalCarrito,
        email: this.correoUsuario,
        commerceOrder: this.commerceOrder,
        subject,

      };

      
       

      const datos = {
        commerceOrder: this.commerceOrder,
        amount: this.totalCarrito,
        email: this.correoUsuario,
        subject: this.generarSubject(this.productos),
      };

      this.carritoService.obtenerLinkPagoPost(datos).subscribe(link => {
        console.log('Link recibido:', link);
      });
      this.carritoService.enviarPago(body).subscribe({
        next: (response) => {
          const urlPago = response.url + '?token=' + response.token;

        },
        error: (err) => {
          console.error('Error al crear el pago:', err);
        }
      });
/*
      await this.dbService.agregarPedido(nuevoPedido);


      for (const producto of this.productos) {
        if (producto.cantidad && producto.stock !== undefined) {
          const nuevoStock = producto.stock - producto.cantidad;
          await this.dbService.actualizarStockProducto(producto.id_prod, nuevoStock);
        }
      }
*/
      // Vaciar el carrito
      this.vaciarCarrito();

      this.carritoService.obtenerLinkPagoPost(datos).subscribe({
        next: (linkPago) => {
          console.log('Link de pago:', linkPago);
          window.open(linkPago, '_blank');
        },
        error: (err) => {
          console.error('Error al obtener link de pago:', err);
        }});


      /*
      this.carritoService.obtenerLinkPago().subscribe({
          next: (linkPago) => {
            console.log('Link de pago:', linkPago);
            window.open(linkPago, '_blank');
          },
          error: (err) => {
            console.error('Error al obtener link de pago:', err);
          }
        });*/



        //alert(JSON.stringify(body));


      console.log('Compra finalizada con éxito.');
     
    } catch (error) {
      console.error('Error al finalizar la compra:', error);
    }
  }

  async guardarcommerceOrder(){
    this.storage.set('ultimoCommerceOrder', this.commerceOrder);
  }

  compraYcommerce(){
    this.finalizarCompra()
    //this.guardarcommerceOrder()
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Éxito',
      buttons: ['Entendido'],
    });

    await alert.present();
  }


  aumentarCantidad(id_prod: number, cantidad: number | undefined): void {
    if (cantidad !== undefined) {

      const nuevaCantidad = cantidad + 1;


      this.carritoService.actualizarCantidad(id_prod, nuevaCantidad);


      this.productos = this.carritoService.obtenerProductos();


      this.calcularTotal();
    } else {
      console.error('Cantidad es undefined. No se puede aumentar la cantidad.');
    }
  }



  disminuirCantidad(id_prod: number, cantidad: number | undefined) {
    if (cantidad !== undefined && cantidad > 1) {
      this.carritoService.actualizarCantidad(id_prod, cantidad - 1);
      this.productos = this.carritoService.obtenerProductos();
      this.calcularTotal();
    } else {
      console.error('Cantidad es undefined o no se puede disminuir más de 1.');
    }
  }


  generarCommerceOrder(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
  }


  generarSubject(productos: Producto[]): string {
    return productos
      .map(p => `${p.cantidad}x ${p.nombre}`)
      .join(', ');
  }





}
