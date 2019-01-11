import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  ViewController ,App} from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';

import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { ConversionProvider } from '../../providers/conversion/conversion';
import { PayPage } from '../pay/pay';
import { Makeconsultation2Page } from '../makeconsultation2/makeconsultation2';


import { LoginPage } from '../../pages/login/login';
/**
 * Generated class for the MakeconsultationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-makeconsultation',
  templateUrl: 'makeconsultation.html',
})
export class MakeconsultationPage {
	public errorCode: any;
	public errorMessage: any;  
	public uid: any;  
	public warning: any;  
	public question: any;  
	public email: any;  
	public mobile: any;  
	public token: any;
	public userProfile: any;
	categories :  any[] = [];       
	selectedCategory : any;         
	time : any;         
	consultationTime : any;         

  constructor(public app : App,
				public modalCtrl: ModalController, 
				public conversion:ConversionProvider,
				public events:Events,
				public session:SessionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public http: Http, 
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,) {
  	    this.uid = navParams.get("uid");	
		//this.loadUserProfile();
		this.loadConsProfile();
					
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MakeconsultationPage');
  }
   loadUserProfile(){
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
			this.token = token['token'];
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=getUserInfo&token='+token['token']; 
				 this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
						 this.errorCode = data.code;
						 this.errorMessage = data.message;
						 this.email = data.userInfo.email;
						 this.mobile = data.userInfo.mobile;
						 },error=>{
							console.log(error);// Error getting the data
						});
			}else{
				this.app.getRootNav().setRoot(LoginPage);
			}
		});
   }  

    loadConsProfile(){
		this.dialog.createDefaultLoading();
		var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=consultation&Op=consultation_specification&uid='+this.uid; 
		 this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
				 this.errorCode = data.code;
				 this.errorMessage = data.message;
				 this.userProfile = data.profile;
				 let min_cons_time = this.userProfile.min_cons_time;
				 let cost_per_minute = this.userProfile.cost_per_minute;
				 //this.categories.push({ value: 1, text: this.time+' دقيقه' });
				 let conTime = 0;
				 let conCost = 0;
				 for( var  i=0 ; i <= 30 ; i++){
					conTime = conTime+parseInt(min_cons_time);
					conCost = conTime*parseInt(cost_per_minute);
					this.categories.push({ value: conTime, text: ' مشاوره '+conTime+' دقیقه '+' - '+conCost+' تومان '	});
				 }
						 
						this.selectedCategory = parseInt(min_cons_time);			 
				 if(this.errorCode != 1)
					this.dialog.raiseError(this.errorMessage,this.errorCode ,1400);
				else{
					//this.smallImage = ;
				}
							
				this.dialog.closeDelayLoading(1500);		
				 },error=>{
					console.log(error);// Error getting the data
					this.dialog.closeLoading();		
					this.dialog.showError('خطا در دريافت اطلاعات');
				});
	}     
   
  	submitQuestion() {
		//alert(this.selectedCategory);
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=checkPayment&time='+this.selectedCategory+'&conUid='+ this.uid+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode == 2){
									let modal = this.modalCtrl.create(PayPage, {payCost: data.cost});
									modal.onDidDismiss(data => { 
									});									
									modal.present();	
								}else if(this.errorCode == 1){
									this.viewCtrl.dismiss();
									let modal = this.modalCtrl.create(Makeconsultation2Page, {time: this.selectedCategory ,uid: this.uid});
									modal.present();									
								}else{
									this.dialog.raiseError(this.errorMessage,this.errorCode,2001);
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
	dismiss() {
		this.viewCtrl.dismiss();
	}
}
