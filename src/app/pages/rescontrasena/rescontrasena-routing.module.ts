import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RescontrasenaPage } from './rescontrasena.page';

const routes: Routes = [
  {
    path: '',
    component: RescontrasenaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RescontrasenaPageRoutingModule {}
