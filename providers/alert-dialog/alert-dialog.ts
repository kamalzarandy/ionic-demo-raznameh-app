import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';

import { AlertController } from 'ionic-angular';


/*
  Generated class for the AlertDialogProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AlertDialogProvider {

	constructor(public alertCtrl: AlertController) {
		console.log('Hello AlertDialogProvider Provider');
	}
	showError(message ) {
	  let alert = this.alertCtrl.create({
		title: 'خطا',
		subTitle: message,
		buttons: ['OK']
	  });
	  alert.present();
	}
	
	showMessage(message ) {
	  let alert = this.alertCtrl.create({
		title: 'توجه',
		subTitle: message,
		buttons: ['OK']
	  });
	  alert.present();
	}	
	
	showPromt( message ) {
	  let alert = this.alertCtrl.create({
		title: '',
		subTitle: message,
		buttons: [
				{
				  text: 'بله',
				  handler: () => {
				  }
				},
				{
				  text: 'خیر',
				  handler: () => {
				  }
				}
		]
	  });
	  alert.present();
	}

}
