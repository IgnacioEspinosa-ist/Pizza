import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministradorUsuarioPageRoutingModule } from './administrador-usuario-routing.module';

import { UsuariosPage } from './administrador-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministradorUsuarioPageRoutingModule
  ],
  declarations: [UsuariosPage]
})
export class AdministradorUsuarioPageModule {}
