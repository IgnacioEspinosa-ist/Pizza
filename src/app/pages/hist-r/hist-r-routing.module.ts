import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistRPage } from './hist-r.page';

const routes: Routes = [
  {
    path: '',
    component: HistRPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistRPageRoutingModule {}
