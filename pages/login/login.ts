import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ConversionProvider } from '../../providers/conversion/conversion';


import { AlertDialogProvider } from '../../providers/alert-dialog/alert-dialog';
import { LoadingDialogProvider } from '../../providers/loading-dialog/loading-dialog';
import { LoginValidatePage } from '../login-validate/login-validate';
//1800
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
export interface UserOptions {
  username: string
}
 
 
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  login: UserOptions = { username: '' };
  submitted = false;

  constructor(
			public conversion:ConversionProvider,
			storage: Storage, 
			public navCtrl: NavController, 
			public alertDialog : AlertDialogProvider,
			public LoadingDialog : LoadingDialogProvider,
			public alertCtrl : AlertController,
			public navParams: NavParams) {
			storage.set('redirect', false);	
				//this.LoadingDialog.createDefaultLoading();
  }

  
  onLogin() {
	  	
	   //   this.userData.login(this.login.username);
		 // this.navCtrl.push(TabsPage);
		if(this.login.username.length != 11)
			this.alertDialog.showError('حداقل طول شماره موبايل می بایست 11 رقم باشد');
		else{
			this.promptMobile('آيا شماره  شما '+this.login.username+' می باشد');
		}
  }
  
  promptMobile( message ){
		this.login.username =  this.conversion.englishNumber(this.login.username);
		let alert = this.alertCtrl.create({
		title: '',
		subTitle: message,
		buttons: [
				{
				  text: 'بله',
				  handler: () => {
						this.navCtrl.push(LoginValidatePage, {
							username: this.login.username
						});					  
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
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
