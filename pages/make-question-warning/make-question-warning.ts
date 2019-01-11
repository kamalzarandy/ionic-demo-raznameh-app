import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';

import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';

//2100
/**
 * Generated class for the MakeQuestionWarningPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-make-question-warning',
  templateUrl: 'make-question-warning.html',
})
export class MakeQuestionWarningPage {

	public warning : any;
	public errorCode: any;
	public errorMessage: any;  	
	public type: any;  	
  constructor(public events:Events,
				public session:SessionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public http: Http, 
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,) {
	  	this.type = navParams.get("type");
					
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MakeQuestionWarningPage');
				this.dialog.createDefaultLoading();
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=notification&Op=questionWarrning&type='+this.type; 
				//alert(url);
				 this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
						 this.errorCode = data.code;
						 this.errorMessage = data.message;
						 if(this.errorCode != 1)
							this.dialog.raiseError(this.errorMessage,this.errorCode,2100);
						 else{
							this.warning = data.output;
						 }
						this.dialog.closeLoading();		
						 },error=>{
							this.dialog.closeLoading();		
							console.log(error);// Error getting the data
							this.dialog.showError('خطا در دريافت اطلاعات');
						});
					
  }
  	submitQuestion() {
		this.viewCtrl.dismiss(true);
	}
  	dismiss() {
		this.viewCtrl.dismiss(false);
	}
}
