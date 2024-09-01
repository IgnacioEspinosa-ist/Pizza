import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaparapiPageRoutingModule } from './maparapi-routing.module';

import { MaparapiPage } from './maparapi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaparapiPageRoutingModule
  ],
  declarations: [MaparapiPage]
})
export class MaparapiPageModule {}
