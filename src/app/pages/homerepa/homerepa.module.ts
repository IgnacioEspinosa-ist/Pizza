import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomerepaPageRoutingModule } from './homerepa-routing.module';

import { HomerepaPage } from './homerepa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomerepaPageRoutingModule
  ],
  declarations: [HomerepaPage]
})
export class HomerepaPageModule {}
