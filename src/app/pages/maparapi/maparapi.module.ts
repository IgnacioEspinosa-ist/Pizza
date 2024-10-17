import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaparapiPageRoutingModule } from './maparapi-routing.module';

import { MapaComponent } from './maparapi.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaparapiPageRoutingModule
  ],
  declarations: [MapaComponent]
})
export class MaparapiPageModule {}
