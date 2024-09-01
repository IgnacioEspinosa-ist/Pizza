import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapacliPage } from './mapacli.page';

const routes: Routes = [
  {
    path: '',
    component: MapacliPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapacliPageRoutingModule {}
