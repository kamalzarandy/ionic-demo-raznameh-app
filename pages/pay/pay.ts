import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';
import { Http } from '@angular/http';

import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { Events } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the PayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {

	public cost: any;  
	public errorCode: any;
	public errorMessage: any;  
	public recordId: any;  
	public payCost: any;  
  constructor(
				private iab: InAppBrowser,
				public http: Http, 
				public session:SessionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public events:Events,
  				public viewCtrl: ViewController,
				public navCtrl: NavController, public navParams: NavParams) {
  	    this.cost = navParams.get("payCost");	
					
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayPage');
  }
  
  
  	dismiss() {
		this.viewCtrl.dismiss(false);
	}
	
	sendToBank(){
		if(this.cost <= 500)
			this.dialog.showError('حداقل مبلغ شارژ 1000 تومان می باشد');
		else{
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						this.dialog.createDefaultLoading();
						const paycost = this.cost*10;
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payment&Op=prepareToPayOnline&cost='+paycost+'&token='+token['token'];  
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode,1101);
								}else{
									this.recordId = data.recordId;
									const browser = this.iab.create('http://'+this.setting.serverAddress+'/callService.php?Func=payment&Op=payOnline&actionMethods=http&recordId='+this.recordId);
									this.viewCtrl.dismiss(false);
									this.errorCode = data.code;
									this.errorMessage = data.message;							
								}
								this.dialog.closeLoading();		
							 },error=>{ 
								console.log(error);// Error getting the data
								this.dialog.showError('خطا در دريافت اطلاعات');
								this.dialog.closeLoading();		
							});					
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});
		}
	}
}
