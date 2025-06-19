
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; // Si usas Storage de Ionic
import { CarritoService } from './services/carrito.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform, private storage: Storage, private menu: MenuController, private carritoService: CarritoService, private router: Router) { }

  ngOnInit() {
    this.menu.swipeGesture(false);

    this.platform.pause.subscribe(() => {
      console.log('La aplicación está en segundo plano');
      this.saveState();
    });

   

    this.platform.resume.subscribe(() => {
      console.log('La aplicación ha regresado al primer plano');
      this.loadState();
    });
  }


  saveState() {
    this.storage.set('isLoggedIn', true);
    this.storage.set('lastPage', 'home');
  }


  loadState() {
    this.storage.get('isLoggedIn').then((isLoggedIn) => {
      if (isLoggedIn) {

        console.log('Restaurando sesión del usuario');
      } else {
        console.log('No hay sesión activa');

      }
    });

    this.storage.get('lastPage').then((lastPage) => {
      if (lastPage) {

        console.log('Navegando a la última página:', lastPage);
      }
    });
  }

  openMenuSecundario() {
    this.menu.open('menuSecundario');
  }

  async logout() {
    await this.carritoService.logout();
    this.menu.close();
    this.router.navigate(['/login']);
  }

 

  closeMenu(menuId: string) {
    this.menu.close(menuId);
  }
}




