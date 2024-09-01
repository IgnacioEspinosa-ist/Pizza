import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilRPage } from './perfil-r.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilRPageRoutingModule {}
