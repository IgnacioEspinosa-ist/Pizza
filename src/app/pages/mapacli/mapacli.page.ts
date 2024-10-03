import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-mapacli',
  templateUrl: './mapacli.page.html',
  styleUrls: ['./mapacli.page.scss'],
})
export class MapacliPage {

  constructor(private navCtrl: NavController) {}

  irAlHome() {
   
    this.navCtrl.navigateRoot('/home');
  }
}