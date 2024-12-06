
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
  constructor(private platform: Platform, private storage: Storage, private menu: MenuController,private carritoService: CarritoService,private router: Router) {}

  ngOnInit() {
    this.menu.swipeGesture(false);
    // Suscribirse al evento "pause" cuando la app pasa a segundo plano
    this.platform.pause.subscribe(() => {
      console.log('La aplicación está en segundo plano');
      this.saveState();  // Guarda el estado de la app, como datos importantes
    });

    // Suscribirse al evento "resume" cuando la app vuelve al primer plano
    this.platform.resume.subscribe(() => {
      console.log('La aplicación ha regresado al primer plano');
      this.loadState();  // Carga el estado guardado previamente
    });
  }

  // Guardar el estado de la aplicación
  saveState() {
    this.storage.set('isLoggedIn', true); // Por ejemplo, guardar si el usuario está logueado
    this.storage.set('lastPage', 'home'); // O guardar la última página visitada
  }

  // Cargar el estado de la aplicación
  loadState() {
    this.storage.get('isLoggedIn').then((isLoggedIn) => {
      if (isLoggedIn) {
        // Restaurar estado, como redirigir al home si el usuario está logueado
        console.log('Restaurando sesión del usuario');
      } else {
        console.log('No hay sesión activa');
        // Redirigir a login si no hay sesión activa
      }
    });

    this.storage.get('lastPage').then((lastPage) => {
      if (lastPage) {
        // Navegar a la última página visitada
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
    this.router.navigate(['/login']);  // Redirigir a la página de login o donde sea necesario
  }

  closeMenu(menuId: string) {
    this.menu.close(menuId);
  }
}

  
  

