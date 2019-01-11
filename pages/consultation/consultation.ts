import { Component } from '@angular/core';
import { Http } from '@angular/http';
import {   NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';


import { ConsultationListPage } from '../consultation-list/consultation-list';
import { ConsultationProfilePage } from '../consultation-profile/consultation-profile';
import { ChatPage } from '../chat/chat';
import { ChatPayPage } from '../chat-pay/chat-pay';
import { MakeQuestionWarningPage } from '../make-question-warning/make-question-warning';
import { MakeFreeQuestionPage } from '../make-free-question/make-free-question';
import { MakeconsultationPage } from '../makeconsultation/makeconsultation';


import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
//error 1100

@Component({
  selector: 'page-consultation',
  templateUrl: 'consultation.html'
})
export class consultation {
	siteContentNav: string = "consultation";
	categoryList: any;
	errorCode: any;
	errorMessage: any;  
	ConsultationList: any;
	questionList: any;
	public index : any;
	public consIndex : any;
	public consLastIndex: any;   
	public questionIndex : any;
	public questionLastIndex: any;   
	public questionListEnter: any;   

	constructor(  
				public events:Events,
				public session:SessionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public http:Http,
				public navCtrl: NavController,	
				public modalCtrl: ModalController, 

	) {
		this.index = 0;
		this.consIndex = 0;
		this.questionIndex = 0;
		this.questionListEnter = false;
		//alert('constructor  consultation');
	}
	
	
	doRefreshConsultation(refresher) {
		console.log('Begin async operation', refresher);
		  this.loadCategory(2);
		  refresher.complete();
	  }	
	
	
	ionViewDidLoad() {
		//alert('ionViewDidLoad   cons list');
	}
  
   ionSelected() {
    // do your stuff here
  }
	ionViewWillEnter() {
		if(this.questionListEnter == true)
			this.myQuestionSelect();
	}  
	

	ngOnInit(){
		this.loadCategory(2);
		//alert('ngOnInit consultation');
	}
	  
    loadCategory( par : any){
		this.dialog.createDefaultLoading();

		var url = '';
		if( par == 2)
			url = 'http://'+this.setting.serverAddress+'/callService.php?Func=category&Op=catList'; 
		else
			url = 'http://'+this.setting.serverAddress+'/callService.php?Func=category&Op=catList&par=2'; 
		 this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
				 this.categoryList = data.category;
				 this.errorCode = data.code;
				 this.errorMessage = data.message;
				 //alert(this.categoryList);
				 },error=>{
					console.log(error);// Error getting the data
					this.dialog.raiseError(this.errorMessage,this.errorCode ,1100);
				});
		this.dialog.closeLoading();		
	}  
	goToConsultationList(item: any) {
		this.navCtrl.push(ConsultationListPage, { title: item.title ,cls_id: item.cls_id});
	}
	consultationSelect(){
		this.index = 0;
		this.questionListEnter = false;
		this.loadCategory(2);
	}
		
	doRefreshMyconsultation(){
		this.index = 0;
		this.loadCategory(2);
	}
	
	//----------my consultation ---------
      loadConsultationList( index ,infiniteScroll=null ){
		  if( index == 0  )
			  this.consLastIndex = false;
		  else if( this.consLastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }		  
		  
			if( index == 0)
				this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userFavorite&Op=userFavoriteConsultation&index='+index+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode,1101);
								}else{
									if( index == 0)
										this.ConsultationList = data.items;
									else{
										if(data.items.length == 0)
											this.consLastIndex = true;										
										var arr2 = this.ConsultationList.concat( data.items );
										this.ConsultationList = arr2;
										infiniteScroll.complete();
									}
									 this.errorCode = data.code;
									 this.errorMessage = data.message;							
								}
								if( index == 0)
									this.dialog.closeLoading();		
							 },error=>{ 
								console.log(error);// Error getting the data
								this.dialog.showError('خطا در دريافت اطلاعات');
								if( index == 0)
									this.dialog.closeLoading();		
							});					
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});
	  }			
		  
	goToConsultationProfile(item: any) {
	    this.navCtrl.push(ConsultationProfilePage, { userTitle: item.pn_name ,uid: item.uid});
	}	
	
	myConsultationSelect(){
  		this.consIndex = 0;
		this.questionListEnter = false;
		this.loadConsultationList(0);
	}
	
	doInfiniteMyConsultation(infiniteScroll) {
		this.consIndex++;
		this.loadConsultationList(this.consIndex ,infiniteScroll);
	}
	
	removeItem(post){
		let index = this.ConsultationList.indexOf(post);
		this.removeToFavorite(post);
		if(index > -1){
		  this.ConsultationList.splice(index, 1);
		}
	}		
	
	removeToFavorite( record ){
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userFavorite&Op=userFavoriteRemove&contentType=2&itmId='+record.uid+'&token='+token['token']; 
					this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
							this.errorCode = data.code;
							this.errorMessage = data.message;
							if(this.errorCode != 1){
								this.dialog.raiseError(this.errorMessage,this.errorCode,1102);
							}else{
								this.dialog.showMessage('حذف با موفقيت انجام شد');
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
	//---------------------------my question ------------------------------------------------------------
      loadQuestionList( index ,infiniteScroll=null ){
		  if( index == 0  )
			  this.questionLastIndex = false;
		  else if( this.questionLastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }		  
			if( index == 0)
				this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=question&Op=questionList&index='+index+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode,1103);
								}else{
									if( index == 0)
										this.questionList = data.questionList;
									else{
										if(data.questionList.length == 0)
											this.questionLastIndex = true;										
										var arr2 = this.questionList.concat( data.questionList );
										this.questionList = arr2;
										infiniteScroll.complete();
									}
									 this.errorCode = data.code;
									 this.errorMessage = data.message;							
								}
								if( index == 0)
									this.dialog.closeLoading();		
							 },error=>{ 
								console.log(error);// Error getting the data
								this.dialog.showError('خطا در دريافت اطلاعات');
								if( index == 0)
									this.dialog.closeLoading();		
							});					
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});
	  }	

	myQuestionSelect(){
  		this.questionIndex = 0;
		this.questionListEnter = true;
		this.loadQuestionList(0);
	}
	doQuestionInfinite(infiniteScroll) {
		this.questionIndex++;
		this.loadQuestionList(this.questionIndex ,infiniteScroll);
	}	
	
	goToChat(item: any) {
		if(item.cons_type == 1)
			this.navCtrl.push(ChatPage, { questionId : item.cst_id });
		else
			this.navCtrl.push(ChatPayPage, { questionId : item.cst_id });

	}	
	makeFreeQuestion(records) {
		
		let modal = this.modalCtrl.create(MakeQuestionWarningPage, { type: 1 });
		modal.onDidDismiss(data => { 
			if(data == true){
				let modal2 = this.modalCtrl.create(MakeFreeQuestionPage, { uid: records.uid });
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
