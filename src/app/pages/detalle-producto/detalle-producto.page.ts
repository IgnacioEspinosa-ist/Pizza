import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
})
export class DetalleProductoPage implements OnInit {

  
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
