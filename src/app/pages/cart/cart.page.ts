import { Component, OnInit } from '@angular/core';
import { AlertController} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  constructor(private alertController: AlertController,private router: Router) { }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Compra Realizada Con Exito',
      buttons: ['Entendido'],
      
    });

 
    

    await alert.present();
    await this.router.navigate(['/mapacli']);
  }
  ngOnInit() {
  }

}
