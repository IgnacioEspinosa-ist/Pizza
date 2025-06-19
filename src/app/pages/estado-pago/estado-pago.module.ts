import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstadoPagoPageRoutingModule } from './estado-pago-routing.module';

import { EstadoPagoPage } from './estado-pago.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstadoPagoPageRoutingModule
  ],
  declarations: [EstadoPagoPage]
})
export class EstadoPagoPageModule {}
