import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { SettingProvider } from '../../providers/setting/setting';


/*
  Generated class for the DialogProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DialogProvider {

	public loading : any ;
	public loadingStatus : any ;
	public alerted : any ;

  constructor(
				public setting:SettingProvider,
				public events:Events,
				public alertCtrl: AlertController,
				public loadingCtrl : LoadingController) {
    console.log('Hello DialogProvider Provider');
	this.loadingStatus = false;
	this.alerted = false;
  }
	createDefaultLoading( ){
		if(this.loadingStatus == false){
			this.createLoading('...لطفا منتظر بمانيد');
			this.loadingStatus = true;
		}
	}

 
	createLoading( message ){
		 this.loading = this.loadingCtrl.create({
			content: message,
		    duration: 10000
		  });
		  this.loading.present();
		  this.loadingStatus = true;
		  setTimeout(() => {
			  if(this.loadingStatus == true){
					this.loading.dismiss();
					this.loadingStatus = false;
			  }
		  }, 5000 );		
	}

	closeLoading(){
		if(this.loadingStatus  == true ){
			this.loading.dismiss();
			this.loadingStatus = false;
		}
	}
	closeDelayLoading(seconds){ 
		if(this.loadingStatus  == true )
			setTimeout(() => {
			  if(this.loadingStatus == true){
					this.loading.dismiss();
					this.loadingStatus = false;
			  }
		}, seconds );		
	}
	
	showError(message ) {
	  let alertBox = this.alertCtrl.create({
		title: 'خطا',
		subTitle: message,
		buttons: ['تایید']
	  });
	  alertBox.present();
	}
	
	showMessage(message ,dialogTitle = null ) {
		if(dialogTitle == null)
			dialogTitle = 'توجه';
	  let alertBox = this.alertCtrl.create({
		title: dialogTitle,
		subTitle: message,
		buttons: ['تایید']
	  });
	  alertBox.present();
	  console.log(message);
	}	
	
	showPromt( message ) {
	  let alertBox = this.alertCtrl.create({
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
	  alertBox.present();
	}

	raiseError(errorMessage ,errorCode ,mobileError ) {
 	  console.log(errorMessage); 
		//	alert(errorCode);
		if( errorCode == 100){
			this.events.publish( 'user:mustLogin' );		
		}
		if( !(this.setting.debug == false && errorCode == 100) && this.alerted == false){
			this.alerted = true;
			let message = errorMessage+'<br/><br/>'+errorCode+'M'+mobileError;
			let alertBox = this.alertCtrl.create({
				title: 'خطا',
				subTitle: message,
				buttons: [{
          text: 'تایید',
          handler: () => {
            this.alerted = false
          }
        }]
				//buttons: ['OK']
			});
			alertBox.present();
		}
	}
}
