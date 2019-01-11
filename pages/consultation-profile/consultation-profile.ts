import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';

import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';
import { ConsultationActivityPage } from '../consultation-activity/consultation-activity';
import { MakeFreeQuestionPage } from '../make-free-question/make-free-question';
import { MakeQuestionWarningPage } from '../make-question-warning/make-question-warning';
import { MakeconsultationPage } from '../makeconsultation/makeconsultation';

//1400
/**
 * Generated class for the ConsultationProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

 
 export interface  userProfiles{
	small_image : any;
} 

 
 
@IonicPage()
@Component({
  selector: 'page-consultation-profile',
  templateUrl: 'consultation-profile.html',
})

export class ConsultationProfilePage {
  public userTitle : any;
  public uid : any;
  //public userProfile : userProfiles={small_image : "assets/img/unknown300.jpg"};
  public userProfile : any;
  public record : any;
  public description : any;
  errorCode: any;
  errorMessage: any;   
  smallImage: any;   
  

  constructor(
				public setting:SettingProvider,
				public events:Events,
				public session:SessionProvider,
				public http:Http,
				public dialog:DialogProvider,
				public navCtrl: NavController, 
				public modalCtrl: ModalController, 
				public popoverCtrl: PopoverController, 
				public navParams: NavParams) 
	{
	  	this.userTitle = navParams.get("userTitle");
	    this.uid = navParams.get("uid");
	}


  	ngOnInit(){
		this.loadUserProfile();
		console.log('ionViewDidLoad ConsultationProfilePage');
		//this.dialog.closeDelayLoading(1500);				
	}
    loadUserProfile(){
		this.dialog.createDefaultLoading();
		var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=consultation&Op=consultation_specification&uid='+this.uid; 
		 this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
				 this.errorCode = data.code;
				 this.errorMessage = data.message;
				 this.userProfile = data.profile;
				 this.description = data.profile.lang_far_work;
				 if(this.errorCode != 1)
					this.dialog.raiseError(this.errorMessage,this.errorCode ,1400);
				else{
					if(this.userProfile.week_1 <= '')
						this.userProfile.week_1 = '-';
					if(this.userProfile.week_2 <= '')
						this.userProfile.week_2 = '-';
					if(this.userProfile.week_3 <= '')
						this.userProfile.week_3 = '-';
					if(this.userProfile.week_4 <= '')
						this.userProfile.week_4 = '-';
					if(this.userProfile.week_5 <= '')
						this.userProfile.week_5 = '-';
					if(this.userProfile.week_6 <= '')
						this.userProfile.week_6 = '-';
					if(this.userProfile.week_7 <= '')
						this.userProfile.week_7 = '-';
					//this.smallImage = ;
				}
							
				this.dialog.closeDelayLoading(1500);		
				 },error=>{
					console.log(error);// Error getting the data
					this.dialog.closeLoading();		
					this.dialog.showError('خطا در دريافت اطلاعات');
				});
	}  
	
	addToFavorite( record ){
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userFavorite&Op=userFavoriteAdd&contentType=2&itmId='+record.pn_uid+'&token='+token['token']; 
					/*
					let headers = new Headers();
					//myheaders.append('token', token['token']); 	
					//headers.append('token', token['token']);
					headers.append('Authorization', 'token'+token['token']);
					var opt = new RequestOptions({
						 headers: headers
						});
						
						//let postParam = {token : token['token']}
					var creds = "token=" + token['token'] ;
					*/
					this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
							this.errorCode = data.code;
							this.errorMessage = data.message;
							if(this.errorCode != 1){
								this.dialog.raiseError(this.errorMessage,this.errorCode ,1401);
							}else{
								this.dialog.showMessage('مشخصات مشاور به لیست علاقه منديها اضافه شد');
							}
						 },error=>{ 
							console.log(error);// Error getting the data
							this.dialog.showError('خطا در دريافت اطلاعات');
						});					
			}else{
				this.events.publish( 'user:mustLogin' );		
			}
		});		
	}	
	
	goToContentList(item: any , listType : any) {
	    this.navCtrl.push(ConsultationActivityPage, { consultationName: item.pn_name ,consultationTitle: item.consultation_title,consultationImage: item.small_image,listType: listType ,uid :this.uid});
	}
	makeFreeQuestion(records) {
		
		let modal = this.modalCtrl.create(MakeQuestionWarningPage, { uid: this.uid });
		modal.onDidDismiss(data => { 
			if(data == true){
				let modal2 = this.modalCtrl.create(MakeFreeQuestionPage, { uid: this.uid });
				modal2.onDidDismiss(data => {
				});		
				modal2.present();	
				
			}
		});		
		modal.present();	
	}
	makeConsultation(records){
		let modal = this.modalCtrl.create(MakeQuestionWarningPage, { type: 2 });
		modal.onDidDismiss(data => { 
			if(data == true){
				let modal2 = this.modalCtrl.create(MakeconsultationPage, { uid: records.uid });
				modal2.onDidDismiss(data => {
				});		
				modal2.present();	
				
			}
		});		
		modal.present();	
		
	}
	
}
