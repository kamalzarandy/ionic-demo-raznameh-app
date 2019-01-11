import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';
//1600
/**
 * Generated class for the IntroductionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';


@IonicPage()
@Component({
  selector: 'page-introduction',
  templateUrl: 'introduction.html',
})
export class IntroductionPage {

	public output : any;
	public errorCode: any;
	public errorMessage: any; 
	public formType: any; 
	public token: any; 
	public pageTitle: any; 
	constructor(
				public setting:SettingProvider,
				public viewCtrl: ViewController,
				public modalCtrl: ModalController, 
				public storage: Storage,
				public dialog:DialogProvider,
				public http: Http, 
				public navCtrl: NavController, 
				public navParams: NavParams
				) {
	  	this.formType = navParams.get("formType");
	  	this.token = navParams.get("token");
	  	//this.pageTitle = navParams.get("pageTitle");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad IntroductionPage');
		this.dialog.createDefaultLoading();
		if( this.formType == 1 ){
			var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=notification&Op=introduction'; 
			this.pageTitle = 'درباره ما';
		}
		else if( this.formType == 2 ){
			var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=notification&Op=notification&token='+this.token+'&version='+this.setting.version; 
			this.pageTitle = 'توجه';
		}
		else if( this.formType == 3 ){
			var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=notification&Op=help&token='+this.token+'&version='+this.setting.version; 
			this.pageTitle = 'تماس با بخش پشتيبانی';
		}
		else if( this.formType == 4 ){
			var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=notification&Op=incomeRole&token='+this.token+'&version='+this.setting.version; 
			this.pageTitle = 'شرایط و قوانین کسب درآمد';
		}
		else
			return;
		this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
				 this.errorCode = data.code;
				 this.errorMessage = data.message;
				 if(this.errorCode != 1)
					this.dialog.raiseError(this.errorMessage,this.errorCode ,1600);
				 else{
					this.output = data.output;
					if( this.formType == 1 )
						this.storage.set('introduction', true);																		
				 }
				this.dialog.closeLoading();		
				 },error=>{
					this.dialog.closeLoading();		
					console.log(error);// Error getting the data
					this.dialog.showError('خطا در دريافت اطلاعات');
				});	
	}
  
  	dismiss() {
		this.viewCtrl.dismiss(false);
	}
}
