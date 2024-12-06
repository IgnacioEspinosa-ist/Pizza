import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistUPageRoutingModule } from './hist-u-routing.module';

import { HistUPage } from './hist-u.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistUPageRoutingModule
  ],
  declarations: [HistUPage]
})
export class HistUPageModule {}
