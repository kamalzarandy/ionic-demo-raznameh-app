import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  ViewController ,App} from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';

import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { ConversionProvider } from '../../providers/conversion/conversion';


import { LoginPage } from '../../pages/login/login';


//2000
/**
 * Generated class for the MakeFreeQuestionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


 
@IonicPage()
@Component({
  selector: 'page-make-free-question',
  templateUrl: 'make-free-question.html',
})
export class MakeFreeQuestionPage {
	public errorCode: any;
	public errorMessage: any;  
	public uid: any;  
	public warning: any;  
	public question: any;  
	public email: any;  
	public mobile: any;  
	public token: any;
	public userProfile: any;
	
  constructor(
				public app : App,
				public conversion:ConversionProvider,
				public events:Events,
				public session:SessionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public http: Http, 
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				) {
  	    this.uid = navParams.get("uid");	
		this.loadUserProfile();
		this.loadConsProfile();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad MakeFreeQuestionPage');
	
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
		if(this.question == null || this.question.length < 15 || this.email == null || this.mobile == null || ( this.mobile.length != 11 && this.mobile.length != 12) ){
			this.dialog.showError('کليه اطلاعات را صحیح درج نمایید');
		}else{
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=question&Op=makeQuestion&consultationId='+this.uid+'&token='+token['token']; 
						//this.mobile = this.conversion.englishNumber(this.mobile);
						let postData=JSON.stringify({question:this.question ,email:this.email,mobile:this.mobile});
						//let headers = new Headers();
						//let headers = new Headers({'Content-Type' : 'application/json'});
						//headers.append('Content-Type', 'application/json');
						//alert('enter posy');
						//this.http.post(url ,postData ,headers)
						this.http.post(url ,postData )
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode,2001);
								}else{
									this.viewCtrl.dismiss();
									this.dialog.showMessage('سوال با موفقيت ثبت شد، در اولين فرصت سوال شما مورد بررسی قرار خواهد گرفت');
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
