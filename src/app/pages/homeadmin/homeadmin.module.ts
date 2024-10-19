import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomeadminPageRoutingModule } from './homeadmin-routing.module'; // Corrige aquí
import { AdminPage } from './homeadmin.page'; // Asegúrate de que este sea el nombre correcto

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeadminPageRoutingModule // Cambia aquí a HomeadminPageRoutingModule
  ],
  declarations: [AdminPage] // Este debe coincidir con el nombre de la clase AdminPage
})
export class HomeadminPageModule {}
