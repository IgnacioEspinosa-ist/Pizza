import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomerepaPage } from './homerepa.page';

const routes: Routes = [
  {
    path: '',
    component: HomerepaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomerepaPageRoutingModule {}
