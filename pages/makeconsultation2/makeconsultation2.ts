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

import { LoginPage } from '../login/login';
import { ChatPayPage } from '../chat-pay/chat-pay';

/**
 * Generated class for the Makeconsultation2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-makeconsultation2',
  templateUrl: 'makeconsultation2.html',
})
export class Makeconsultation2Page {
	public errorCode: any;
	public errorMessage: any;  
	public uid: any;  
	public warning: any;  
	public question: any;  
	public email: any;  
	public mobile: any;  
	public token: any;
	public userProfile: any;
	conTime : any;         
	conCost : any;         

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
				public viewCtrl: ViewController) {
  	    this.conTime = navParams.get("time");	
  	    this.uid = navParams.get("uid");					
  }

  ionViewDidLoad() {
	this.loadConsProfile();
	this.loadUserProfile();
    console.log('ionViewDidLoad Makeconsultation2Page');
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
				this.conCost = this.conTime*parseInt(cost_per_minute);
						 
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
	
  	submitQuestion() {
		if(this.question == null || this.question.length < 5  || this.mobile == null || ( this.mobile.length != 11 && this.mobile.length != 12) ){
			this.dialog.showError('کليه اطلاعات را صحیح درج نمایید');
		}else{
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=makeQuestion&time='+this.conTime+'&conUid='+ this.uid+'&token='+token['token']; 
						let postData=JSON.stringify({question:this.question ,email:this.email,mobile:this.mobile});
						this.http.post(url ,postData )
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1 || data.cst_id <= '' ){
									this.dialog.raiseError(this.errorMessage,this.errorCode,2001);
								}else{
									this.viewCtrl.dismiss();
									this.navCtrl.push(ChatPayPage, { questionId : data.cst_id ,cameType : 1});
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
	dismiss() {
		this.viewCtrl.dismiss();
	}	
  
}
