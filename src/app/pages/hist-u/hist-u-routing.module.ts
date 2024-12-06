import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistUPage } from './hist-u.page';

const routes: Routes = [
  {
    path: '',
    component: HistUPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistUPageRoutingModule {}
