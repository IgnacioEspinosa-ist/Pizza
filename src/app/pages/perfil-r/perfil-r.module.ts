import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilRPageRoutingModule } from './perfil-r-routing.module';

import { PerfilRPage } from './perfil-r.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilRPageRoutingModule
  ],
  declarations: [PerfilRPage]
})
export class PerfilRPageModule {}
