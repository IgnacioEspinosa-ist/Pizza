import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from 'src/app/services/carrito.service';// Servicio para el API externo

@Component({
  selector: 'app-estado-pago',
  templateUrl: './estado-pago.page.html',
  styleUrls: ['./estado-pago.page.scss'],
})
export class EstadoPagoPage implements OnInit {
  commerceOrder: string | null = null;
  pagoEstado: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private router: Router
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

  consultarEstadoPago(commerceOrder: string) {
    this.loading = true;
    this.carritoService.obtenerEstadoPorCommerceOrder(commerceOrder).subscribe({
      next: (resp) => {
        this.pagoEstado = resp;
        this.loading = false;

        if (this.pagoEstado.status === 2) {
          // Pago aprobado
        } else {
          // Pago rechazado o pendiente
        }
      },
      error: (err) => {
        this.error = 'Error al consultar el estado del pago.';
        this.loading = false;
      }
    });
  }

  irInicio() {
    this.router.navigate(['/home']);
  }
}
