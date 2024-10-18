import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosPage } from './administrador-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorUsuarioPageRoutingModule {}
