import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-r',
  templateUrl: './perfil-r.page.html',
  styleUrls: ['./perfil-r.page.scss'],
})
export class PerfilRPage implements OnInit {

  constructor(private menu: MenuController) { }

  ngOnInit() {
  }

  
  openMenuSecundario() {
    this.menu.open('menuSecundario'); 
  }
}
