import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RescontrasenaPageRoutingModule } from './rescontrasena-routing.module';

import { RescontrasenaPage } from './rescontrasena.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RescontrasenaPageRoutingModule
  ],
  declarations: [RescontrasenaPage]
})
export class RescontrasenaPageModule {}
