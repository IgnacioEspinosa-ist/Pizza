import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleComboPageRoutingModule } from './detalle-combo-routing.module';

import { DetalleComboPage } from './detalle-combo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleComboPageRoutingModule
  ],
  declarations: [DetalleComboPage]
})
export class DetalleComboPageModule {}
