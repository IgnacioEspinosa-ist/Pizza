import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPage } from './homeadmin.page'; // Asegúrate de que este sea el nombre correcto

const routes: Routes = [
  {
    path: '',
    component: AdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeadminPageRoutingModule {}
