import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';

import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';

import { ConsultationProfilePage } from '../consultation-profile/consultation-profile';
import { MoreQuestionPage } from '../more-question/more-question';
import { PollQuestionPage } from '../poll-question/poll-question';

//error 1000
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
	public errorCode: any;
	public errorMessage: any;   	
	public question: any;   	
	public questionId : any ;
	public users : any ;
	constructor(				
				public setting:SettingProvider,
				public events:Events,
				public session:SessionProvider,
				public http:Http,
				public dialog:DialogProvider,
				public navCtrl: NavController, 
				public modalCtrl: ModalController, 
				public navParams: NavParams) 
	{
	    this.questionId = navParams.get("questionId");	  
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ChatPage');
	}
 	ngOnInit(){
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
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1000);
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
  	goToConsultationProfile(item: any) {
			this.navCtrl.push(ConsultationProfilePage, { userTitle: item.lang_far_title ,uid: item.uid});
	}
	submitPoll(record){
		let modal = this.modalCtrl.create(PollQuestionPage, { questionId: this.questionId });
		modal.onDidDismiss(data => {
			if(data == true)
				this.loadQuestion();
		});		
		modal.present();		
	}
	submitQuestion(record){
		let modal = this.modalCtrl.create(MoreQuestionPage, { questionId: this.questionId });
		modal.onDidDismiss(data => {
			if(data == true)
				this.loadQuestion();
		});		
		modal.present();		
	}
}
