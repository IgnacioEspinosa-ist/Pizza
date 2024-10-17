import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaComponent } from './maparapi.page';

const routes: Routes = [
  {
    path: '',
    component: MapaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaparapiPageRoutingModule {}
