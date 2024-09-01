import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaparapiPage } from './maparapi.page';

const routes: Routes = [
  {
    path: '',
    component: MaparapiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaparapiPageRoutingModule {}
