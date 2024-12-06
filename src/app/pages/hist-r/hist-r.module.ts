import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistRPageRoutingModule } from './hist-r-routing.module';

import { HistRPage } from './hist-r.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistRPageRoutingModule
  ],
  declarations: [HistRPage]
})
export class HistRPageModule {}
