import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menu: MenuController) {}

  openMenuSecundario() {
    this.menu.open('menuSecundario'); 
  }
<<<<<<< HEAD

  closeMenu(menuId: string) {
    this.menu.close(menuId);
  }
=======
>>>>>>> 1085e3d40755edad5bbc127605bdced2b040019c
}
