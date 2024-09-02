import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleComboPage } from './detalle-combo.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleComboPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleComboPageRoutingModule {}
