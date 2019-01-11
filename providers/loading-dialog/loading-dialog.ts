import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the LoadingDialogProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LoadingDialogProvider {

	public loading : any ;
  constructor(public loadingCtrl : LoadingController) {
    console.log('Hello LoadingDialogProvider Provider');
  }
  
	createDefaultLoading( ){
		this.createLoading('...لطفا منتظر بمانيد');
	}

 
	createLoading( message ){
		 this.loading = this.loadingCtrl.create({
			content: message
		  });
		  this.loading.present();
	}

	closeLoading(){
		  this.loading.dismiss();
	}
}
