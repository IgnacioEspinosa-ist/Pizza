import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtcPage } from './otc.page';

const routes: Routes = [
  {
    path: '',
    component: OtcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtcPageRoutingModule {}
