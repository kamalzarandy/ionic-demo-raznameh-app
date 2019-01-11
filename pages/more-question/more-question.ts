import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';

import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';

//2200
/**
 * Generated class for the MoreQuestionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-more-question',
  templateUrl: 'more-question.html',
})
export class MoreQuestionPage {

	public question : any;
	public questionId : any;
	public errorCode: any;
	public errorMessage: any;  
	public questionType: any;  

	constructor(
				public events:Events,
				public session:SessionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public http: Http, 
				public navCtrl: NavController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				) {
	    this.questionId = navParams.get("questionId");	  
	    this.questionType = navParams.get("questionType");	  
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad MoreQuestionPage');
	}
	
	submitQuestion() {
		if(this.question == null || this.question.length < 5 ){
			this.dialog.showError('لطفا سوال يا پاسخ خود را ثبت نمایید');
		}else{
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						if(this.questionType == 2)
							var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=moreQuestion&questionId='+this.questionId+'&token='+token['token']; 
						else
							var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=question&Op=moreQuestion&questionId='+this.questionId+'&token='+token['token']; 
						let postData=JSON.stringify({question:this.question});
						/*let headers = new Headers();
						headers.append('Content-Type', 'application/json');*/
						this.http.post(url ,postData)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,2200);
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
	dismiss() {
		this.viewCtrl.dismiss(false);
	}
}
