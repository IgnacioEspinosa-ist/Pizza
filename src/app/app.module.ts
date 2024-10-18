import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { DatabaseService } from './services/database.service';
import { IonicStorageModule } from '@ionic/storage-angular';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule, 
    MatProgressSpinnerModule  ,
    ReactiveFormsModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},SQLite,DatabaseService 
    
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
