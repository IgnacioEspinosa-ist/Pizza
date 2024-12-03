import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CambioconPageRoutingModule } from './cambiocon-routing.module';

import { CambioconPage } from './cambiocon.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CambioconPageRoutingModule
  ],
  declarations: [CambioconPage]
})
export class CambioconPageModule {}
