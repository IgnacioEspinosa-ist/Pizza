import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorPageRoutingModule } from './error-routing.module';

import { ErrorPage } from './error.page';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ErrorPageRoutingModule,
    MatProgressSpinnerModule
  ],
  declarations: [ErrorPage]
})
export class ErrorPageModule {}
