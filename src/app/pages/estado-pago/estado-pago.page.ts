import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { CarritoService } from 'src/app/services/carrito.service';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-estado-pago',
  templateUrl: './estado-pago.page.html',
  styleUrls: ['./estado-pago.page.scss'],
})
export class EstadoPagoPage implements OnInit, OnDestroy {
  commerceOrder: string | null = null;
  pagoEstado: any = null;
  loading = true;
  error: string | null = null;
  private intervaloEstado: any;

  constructor(
    private storage: Storage,
    private carritoService: CarritoService,
    private router: Router,
    private route: ActivatedRoute,
    private dbService: DatabaseService,
  ) { }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.commerceOrder = params['commerceOrder'] || null;
      if (this.commerceOrder) {
        this.consultarEstadoPago(this.commerceOrder);
      } else {
        this.error = 'No se encontró la orden de compra.';
        this.loading = false;
      }
    });
  }



  /*async ngOnInit() {
    this.commerceOrder = await this.storage.get('ultimoCommerceOrder');
    if (this.commerceOrder) {
      this.verificarEstadoPeriodicamente(this.commerceOrder);
    } else {
      this.error = 'No se encontró la orden de compra en el almacenamiento.';
      this.loading = false;
    }
  }*/

  verificarEstadoPeriodicamente(order: string) {
    this.consultarEstadoPago(order); // Primera consulta inmediata
    this.intervaloEstado = setInterval(() => {
      this.consultarEstadoPago(order);

      if (this.pagoEstado && this.pagoEstado.status !== 1) {
        clearInterval(this.intervaloEstado); // Para el timer si ya no está pendiente
      }
    }, 5000);
  }

  consultarEstadoPago(commerceOrder: string) {
    this.loading = true;
    this.carritoService.obtenerEstadoPorCommerceOrder(commerceOrder).subscribe({
      next: async (resp) => {
        this.pagoEstado = resp;
        this.loading = false;

        if (this.pagoEstado.status === 2) {
          // Si está aprobado, guardar pedido
          const pedido = {
            commerceOrder: this.pagoEstado.commerceOrder,
            descripcion: this.pagoEstado.subject,
            correo: this.pagoEstado.payer,
            total: this.pagoEstado.amount,
            fecha: this.pagoEstado.paymentData?.date || new Date().toISOString()
          };

          try {
            await this.dbService.agregarPedidoDesdeFlow(pedido);
            console.log('Pedido guardado en la base de datos local');
          } catch (error) {
            console.error('Error al guardar pedido aprobado:', error);
          }
        }
      },
      error: (err) => {
        this.error = 'Error al consultar el estado del pago.';
        this.loading = false;
      }
    });
  }

  async guardarPedido() {
    try {
      const idUser = await this.storage.get('id_user');
      if (!idUser) {
        console.error('No se pudo obtener el id_user del almacenamiento.');
        return;
      }

      const productos = await this.carritoService.obtenerProductos();
      const totalCarrito = productos.reduce((acc, p) => acc + (p.stock * p.precio), 0);

      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localDateTime = new Date(now.getTime() - offset).toISOString().slice(0, 19).replace('T', ' ');

      const nuevoPedido = {
        f_pedido: localDateTime,
        id_user: idUser,
        id_direccion: 1, 
        total: this.pagoEstado.amount, 
        id_user_resp: undefined,
        descripcion: this.pagoEstado.subject,
        estatus: 'pendiente'
      };

      await this.dbService.agregarPedido(nuevoPedido);

      // Actualizar stock y vaciar carrito (similar a lo que tenías antes)
      for (const producto of productos) {
        if (producto.cantidad && producto.stock !== undefined) {
          const nuevoStock = producto.stock - producto.cantidad;
          await this.dbService.actualizarStockProducto(producto.id_prod, nuevoStock);
        }
      }

      this.carritoService.vaciarCarrito();

      console.log('Pedido guardado y stock actualizado correctamente.');
    } catch (error) {
      console.error('Error guardando el pedido:', error);
    }
  }


  irInicio() {
    this.router.navigate(['/home']);
  }

  irMapa() {
    this.guardarPedido()
    this.router.navigate(['/mapacli']);

  }

  ngOnDestroy() {
    if (this.intervaloEstado) {
      clearInterval(this.intervaloEstado);
    }
  }
}
