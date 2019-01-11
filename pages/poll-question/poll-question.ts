import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';

import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';
//2400
/**
 * Generated class for the PollQuestionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-poll-question',
  templateUrl: 'poll-question.html',
})
export class PollQuestionPage {
	
	public errorCode: any;
	public errorMessage: any;   	
	public question: any;   	
	public questionId : any ;
	public users : any ;
	public userPoll : any ;
	public userDescription : any ;
	
	constructor(	public setting:SettingProvider,
					public events:Events,
					public session:SessionProvider,
					public http:Http,
					public dialog:DialogProvider,
					public navCtrl: NavController, 
					public modalCtrl: ModalController, 
					public navParams: NavParams,
					public viewCtrl: ViewController,
				) {
		    this.questionId = navParams.get("questionId");	  
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad PollQuestionPage');
	this.loadQuestion();
  }
  
  
      loadQuestion(){
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=question&Op=questionSpecification&questionId='+this.questionId+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,2400);
								}else{
									this.question = data.question;
									this.users = data.users;
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
		this.viewCtrl.dismiss(false);
	}
	
	submitUserPoll() {
		if(this.userPoll == null || this.userPoll <= '' ){
			this.dialog.showError('لطفا پاسخ مشاور را ارزیابی فرماييد');
		}else{
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=question&Op=pollQuestion&questionId='+this.questionId+'&token='+token['token']; 
						let postData=JSON.stringify({comment:this.userDescription ,poll:this.userPoll});
						/*let headers = new Headers();
						headers.append('Content-Type', 'application/json');*/
						this.http.post(url ,postData )
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,2401);
								}else{
									this.viewCtrl.dismiss(true);
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
