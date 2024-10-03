import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-combo',
  templateUrl: './detalle-combo.page.html',
  styleUrls: ['./detalle-combo.page.scss'],
})
export class DetalleComboPage implements OnInit {

  constructor(private alertController: AlertController,private router: Router) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Se Ha Añadido Al Carro',
      buttons: ['Entendido'],
      
    });

 
    

    await alert.present();
    await this.router.navigate(['/cart']);
  }

  ngOnInit() {
  }
}

