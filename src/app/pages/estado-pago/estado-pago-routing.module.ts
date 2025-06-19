import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoPagoPage } from './estado-pago.page';

const routes: Routes = [
  {
    path: '',
    component: EstadoPagoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstadoPagoPageRoutingModule {}
