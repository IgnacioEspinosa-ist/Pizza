import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioconPage } from './cambiocon.page';

const routes: Routes = [
  {
    path: '',
    component: CambioconPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambioconPageRoutingModule {}
