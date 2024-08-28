import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtcPageRoutingModule } from './otc-routing.module';

import { OtcPage } from './otc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtcPageRoutingModule
  ],
  declarations: [OtcPage]
})
export class OtcPageModule {}
