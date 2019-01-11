import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';


import { AlertDialogProvider } from '../../providers/alert-dialog/alert-dialog';
//import { LoadingDialogProvider } from '../../providers/loading-dialog/loading-dialog';
import { SessionProvider } from '../../providers/session/session';
import { TabsPage } from '../../pages/tabs/tabs';
import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { ConversionProvider } from '../../providers/conversion/conversion';

//1900
/**
 * Generated class for the LoginValidatePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-validate',
  templateUrl: 'login-validate.html',
})
export class LoginValidatePage {
	
	login = { verification: '' };
	public username : any;


	constructor(
		public conversion:ConversionProvider,
		public setting:SettingProvider,
		public dialog:DialogProvider,
		public navCtrl: NavController, 
		public http:Http,
		public alertDialog:AlertDialogProvider,
		public session : SessionProvider,
		public events: Events,
		public navParams: NavParams) {
			
		this.username = navParams.get("username");
	}

	ionViewWillEnter() {
		this.session.sendValidationCodeSms(this.username);
	}

	backToLogin(){
		this.navCtrl.popToRoot();
	}
  
    validate() {
		//alert('going to validate = 1');
		this.login.verification =  this.conversion.englishNumber(this.login.verification);
		this.session.validateCodeAndLogin('98' ,this.username ,this.login.verification);
		this.events.subscribe('user:login', () => {
				this.navCtrl.setRoot(TabsPage);				
		  });		
		
		/*//alert('going to check is login = 2');
		this.session.hasLoggedIn().then((hasLoggedIn) => {
			if(hasLoggedIn == true){
				//alert('user login and go to transfer to root = 3');
			}else{
				//alert('user not login = 4');

			}
		});
		*/
	}
    sendCodeAgain() {
		this.session.sendValidationCodeSms(this.username);
	}
	


  
}
