import { Injectable } from '@angular/core';
//import { Headers ,RequestOptions} from '@angular/http';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { Platform } from 'ionic-angular';

//import { Router } from 'angular2/router';

//import 'rxjs/add/operator/map';

import { Storage } from '@ionic/storage';

import { DialogProvider } from '../../providers/dialog/dialog';
import { SettingProvider } from '../../providers/setting/setting';
//error 100
/*
  Generated class for the SessionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SessionProvider {
	HAS_LOGGED_IN = 'hasLoggedIn';
	is_loged_in = false;
	errorCode: any;
	errorMessage: any;   
	mobile: any;   
	pass: any;   
	pass_expire_time: any;   
	uid: any;   
	token: any;   
	token_expire_time: any;
	//public navCtrl: NavController;

	constructor(
				public setting:SettingProvider,
				public storage: Storage,
				public http:Http,
				public http2:Http,
				public dialog:DialogProvider,
				public events: Events,
				private platform: Platform,
				) {
				
		console.log('Hello SessionProvider Provider');
	}
	
	setValue(name:any , value : any){
		this.storage.set(name, value);
	}
	getValue(name: any ){
	    return this.storage.get(name).then((val) => {
			return val		});
	}
	login( mobile ,pass ,pass_expire_time ,token ,token_expire_time) { 
		this.storage.set(this.HAS_LOGGED_IN, true);
		//alert('login function call');
		this.storage.set('mobile', mobile);
		this.storage.set('pass', pass);
		this.storage.set('pass_expire_time', pass_expire_time);
		this.storage.set('token', token);
		this.storage.set('token_expire_time', token_expire_time);
		this.is_loged_in = true;
		
		this.events.publish( 'user:login' );		
		
		this.dialog.closeLoading();
		//return true;
		//this.setUsername(username);
		//this.events.publish('user:login');
	};
	


	signup(username: string): void {
		this.storage.set(this.HAS_LOGGED_IN, true);
		//this.setUsername(username);
		//this.events.publish('user:signup');
	};

	logout(): boolean{
		this.storage.remove(this.HAS_LOGGED_IN);
		this.storage.remove('mobile');
		this.storage.remove('pass');
		this.storage.remove('pass_expire_time');
		this.storage.remove('token');
		this.storage.remove('token_expire_time');
		return true;
	};
	hasLoggedIn(): Promise<boolean> {
		return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
		 //alert('value='+value);
		  return value === true;
		});
	}; 
	
	userHasLoggedIn() {
		return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
		 //alert('value='+value);
		  return value === true;
		});
	};
	
	
	sendValidationCodeSms( mobileNumber ){
		this.dialog.createDefaultLoading();
		var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=sendCode&countryCode=98&mobile='+mobileNumber; 
		//alert(url);
		this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
					this.errorCode = data.code;
					this.errorMessage = data.message;
					if(this.errorCode != 1){
						this.dialog.closeLoading();
							this.dialog.raiseError(this.errorMessage,this.errorCode ,100);
					}else{
						this.dialog.closeLoading();
					}
				 },error=>{
					console.log(error);// Error getting the data
					this.dialog.closeLoading();				
					this.dialog.showError('خطا در ارسال اطلاعات');
				});
	}	
	
   validateCodeAndLogin(countryCode ,mobile ,verification)  {
		this.dialog.createDefaultLoading();
		var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=verifyCode&countryCode='+countryCode+'&mobile='+mobile+'&code='+verification; 
		 this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
					this.errorCode = data.code;
					this.errorMessage = data.message;
					if(this.errorCode != 1){
						this.dialog.closeLoading();
						this.dialog.raiseError(this.errorMessage,this.errorCode ,101);
					}
					else{
						this.mobile = data.mobile;
						this.pass = data.pass;
						this.pass_expire_time = data.pass_expire_time;
						this.createFirstToken(this.mobile ,this.pass);
					}
				 },error=>{
					console.log(error);// Error getting the data
					this.dialog.closeLoading();
					this.dialog.showError('خطا در ارسال اطلاعات');
				});
	}	
		
		
	sendDeviceInformation( token : any){
		var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=logAccess&Op=logUserAccess&token='+token; 
		let postData=JSON.stringify({platform:this.platform.platforms() ,width:this.platform.width(),height:this.platform.height(),versions:this.platform.versions(),lang:this.platform.lang(),app_version:this.setting.version});
		//let postData=JSON.stringify({platform:1});
		this.http.post(url ,postData)	
		 .map(res => res.json())
		 .subscribe(data => {
			 //alert(JSON.stringify(data));
			 },error=>{ 
				console.log(error);// Error getting the data
			});					
			
	}

	createFirstToken(mobile ,pass){

		var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=createToken&mobile='+mobile+'&pass='+pass; 
		 this.http2.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
					this.errorCode = data.code;
					this.errorMessage = data.message;
					if(this.errorCode != 1){
						this.dialog.raiseError(this.errorMessage,this.errorCode,102);
					}else{
						this.mobile = data.mobile;
						this.pass = data.pass;
						this.uid = data.uid;
						this.pass_expire_time = data.pass_expire_time;
						this.token = data.token;
						this.token_expire_time = data.token_expire_time;
						this.login(this.mobile ,this.pass ,this.pass_expire_time ,this.token ,this.token_expire_time);
						this.sendDeviceInformation(this.token);
					}
				 },error=>{ 
					console.log(error);// Error getting the data
					this.dialog.showError('خطا در ارسال اطلاعات');
				});	
	}

	getUserToken(): Promise <any> {
		 let arr = [];
		return this.storage.forEach( (value, key, index) => {
			//arr.push(value);
			arr[key] = value;
			//if (key == 'token') { this.token = value }
			//data[key] = value;
		}).then(() => {
			return arr;

    });
	
		/*
		return this.storage.get('token').then((value) => {
			return value;
		});
		*/
	};	
	
	refreshToken( mobile ,pass ,pass_expire_time ,token ,token_expire_time) { 
		this.storage.set(this.HAS_LOGGED_IN, true);
		//alert('login function call');
		this.storage.set('mobile', mobile);
		this.storage.set('pass', pass);
		this.storage.set('pass_expire_time', pass_expire_time);
		this.storage.set('token', token);
		this.storage.set('token_expire_time', token_expire_time);
		this.is_loged_in = true;
		//return true;
		//this.setUsername(username);
		//this.events.publish('user:login');
	};		
	
	createSecondToken(){
		this.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=createToken&mobile='+token['mobile']+'&pass='+token['pass']+'&token='+token['token']; 
					/*							
					let myheaders = new Headers();
					myheaders.set('token', token['token']); 	
					var opt = new RequestOptions({
						 headers: myheaders
						});
					this.http.get(url,opt)
					*/
					this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
							this.errorCode = data.code;
							this.errorMessage = data.message;
							if(this.errorCode != 1){
								this.dialog.raiseError(this.errorMessage,this.errorCode,104);
								this.events.publish( 'user:mustLogin' );		
							}else{
								this.mobile = data.mobile;
								this.pass = data.pass;
								this.uid = data.uid;
								this.pass_expire_time = data.pass_expire_time;
								this.token = data.token;
								this.token_expire_time = data.token_expire_time;
								//alert(this.pass+'  |  '+this.pass_expire_time+'   |     '+this.token+'      |    '+this.token_expire_time);
								this.refreshToken(this.mobile ,this.pass ,this.pass_expire_time ,this.token ,this.token_expire_time);
								//this.sendDeviceInformation(this.token);
							}
						 },error=>{ 
							console.log(error);// Error getting the data
							this.dialog.showError('خطا در ارسال اطلاعات');
						});					
			}else{
				this.events.publish( 'user:mustLogin' );		
			}
		});
	}
	
	compareExpireTime(){
		this.getUserToken().then((token) => {
			
		});
	}

	/*
	let promise = new Promise((resolve, reject) => {
		  if () {
			resolve('Success!');
		  } else {
			reject('Oops... something went wrong');
		  }
		});
		*/
}
