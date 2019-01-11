import { Component } from '@angular/core';
import {  NavController, NavParams ,App } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ViewItemPage } from '../view-item/view-item';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SettingProvider } from '../../providers/setting/setting';
import { SessionProvider } from '../../providers/session/session';

import { IntroductionPage } from '../introduction/introduction';
import { ConsultationProfilePage } from '../consultation-profile/consultation-profile';
import { MakeconsultationPage } from '../makeconsultation/makeconsultation';
import { MakeQuestionWarningPage } from '../make-question-warning/make-question-warning';
import { MakeFreeQuestionPage } from '../make-free-question/make-free-question';
import { LoginPage } from '../../pages/login/login';
import { NotificationPage } from '../../pages/notification/notification';

//1500
//import { LocalNotifications } from '@ionic-native/local-notifications';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	siteContentNav: string = "raznamehHome";
	public pageTitle : any;
	public conTypeTitle : any;
	public cls_id : any;
	public categoryType : any;
	itemsList: any;
	errorCode: any;
	errorMessage: any;   
	public index : any;
	public lastIndex: any;   

	public notification : any;
	public introduce : any;
	public firstAlarm : any;
	public ConsultationList : any;
  	public consultationLastIndex: any;   
  	public consultationIndex: any;   
  	public searchValue: any;   
  	public discountLastIndex: any;   
  	public discountIndex: any;   
  	public discountItems: any;   
  	public notIndex: any;   
  	public notLastIndex: any;   
  	public notItems: any;   

  constructor(
				public events:Events,
				public session:SessionProvider,
				public modalCtrl: ModalController, 
				public storage: Storage,
				public setting:SettingProvider,
				public navCtrl: NavController, 
				public app:App,
				public http:Http,
				public dialog:DialogProvider,
				public navParams: NavParams,
				public alertCtrl : AlertController,
//				public localnot: LocalNotifications
			  ) {
		this.index = 0;
		this.consultationIndex = 0;
		this.discountIndex = 0;
		this.firstAlarm = false;
		this.notification = false;
		this.introduce = false;
		this.discountLastIndex = false;
		this.consultationLastIndex = false;
		this.notLastIndex = false;
		this.notIndex = 0;
/*this.localnot.schedule([{
   id: 1,
   title: 'Local ILocalNotification Example',
   text: 'Multi ILocalNotification 2',
   icon: 'http://example.com/icon.png'
}]);
*/
	}

			  
	ionViewWillEnter() {
	}
	ionViewDidLoad(){
		//alert(cordova.file.externalRootDirectory);
		//alert(cordova.file.dataDirectory);
		//alert(cordova.file.externalDataDirectory);
		this.loadItemList();		
	}
  
  
      loadItemList(){
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					this.dialog.createDefaultLoading();
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=item&Op=homePageList&token='+token['token']; 
					//alert(url);
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
							 this.itemsList = data.items;
							 this.errorCode = data.code;
							 this.errorMessage = data.message;
							 if(this.errorCode != 1){
								this.dialog.raiseError(this.errorMessage,this.errorCode ,1502);
							 }else{
								 if(this.firstAlarm == false){
									this.firstAlarm = true;
									//this.showIntroduction();
									this.showNotification();
								 }
							 }
								this.dialog.closeDelayLoading(1500);		
							 },error=>{
								this.dialog.closeLoading();
								console.log(error);// Error getting the data
								this.dialog.showError('خطا در دريافت اطلاعات');
							});
				}else{
					this.events.publish( 'user:mustLogin' );		
				}				
			});			  
	  }  
	  
	goToItemView(item: any) {
	    this.navCtrl.push(ViewItemPage, { pageTitle: item.user_title ,itmId: item.prt_itm_id});
	}
	
	ngOnInit(){
		console.log('ngOnInit ');
		//this.loadItemList();		
	}
	
	doRefresh(refresher) {
		//alert('doRefresh');
		console.log('Begin async operation', refresher);
		  this.loadItemList();
		  refresher.complete();
		  this.index = 0;
	}	
	

  doInfinite(infiniteScroll) {
	  //alert('doInfinite');
	  
		  if( this.index == 0  )
			  this.lastIndex = false;
		  else if( this.lastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }
		  	  
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					this.index ++;
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=item&Op=homePageList'+'&index='+this.index+'&token='+token['token']; 
					//alert(url);
						 this.http.get(url)
							 .map(res => res.json())
							 .subscribe(data => {
								if(data.items.length == 0)
									this.lastIndex = true;								 
								 var arr2 = this.itemsList.concat( data.items );
								 this.itemsList = arr2;
								 //this.itemsList = data.items;
								 this.errorCode = data.code;
								 this.errorMessage = data.message;
									   
								 infiniteScroll.complete();

								 if(this.errorCode != 1)
										this.dialog.raiseError(this.errorMessage,this.errorCode ,1501);
								 //alert(this.categoryList);
								 },error=>{
									console.log(error);// Error getting the data
									this.dialog.showError('خطا در دريافت اطلاعات');
								});
				}else{
					this.events.publish( 'user:mustLogin' );		
				}			
		});
				
  }
  
  showNotification(){
	  if(this.notification == false){
			this.session.getUserToken().then((token) => {
				if( token['token'] > '' ){ 
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=notification&Op=notification&alarm=1&token='+token['token']+'&version='+this.setting.version; 
					this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
							 this.errorCode = data.code;
							 this.errorMessage = data.message;
							 if(this.errorCode == 1){
									let modal = this.modalCtrl.create(IntroductionPage,{ formType: 2 , token:token['token']});
									modal.present();	
							 }

							this.dialog.closeLoading();		
							 },error=>{
								console.log(error);// Error getting the data
							});					
				

				}else{
					this.events.publish( 'user:mustLogin' );		
				}				
			});	
		this.notification = true;
	  }
  }
  
	showIntroduction(){ 
			this.session.getUserToken().then((token) => {
				if( (token['introduction'] <= '' || token['introduction'] == null || token['introduction'] == false ) && token['token'] > ''){ 
					let modal = this.modalCtrl.create(IntroductionPage,{ formType: 1 });
					modal.present();	
				}					
			});					  
	}
	
//----------------------------------------------------------
    loadConsultationList( index ,infiniteScroll = null ,searchValue = null){
		  if( index == 0  )
			  this.consultationLastIndex = false;
		  else if( this.consultationLastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }
		  
			if( index == 0)
				this.dialog.createDefaultLoading();
			var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=consultation&Op=consultation_list&index='+index; 
			if( searchValue != null )
				var url = url +'&search='+searchValue; 
			 this.http.get(url)
				 .map(res => res.json())
				 .subscribe(data => {
					 this.errorCode = data.code;
					 this.errorMessage = data.message;
						if(this.errorCode != 1){
							this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
						}else{
								if( index == 0)
									this.ConsultationList = data.category;
								else{
									if(data.category.length == 0)
										this.consultationLastIndex = true;
									var arr2 = this.ConsultationList.concat( data.category );
									this.ConsultationList = arr2;
									infiniteScroll.complete();
								}							
						}						 
						if( index == 0)
							this.dialog.closeDelayLoading(1500);		
					 //alert(this.categoryList);
					 },error=>{
						if( index == 0)
							this.dialog.closeLoading();		
						console.log(error);// Error getting the data
						this.dialog.showError('خطا در دريافت اطلاعات');
					});
	}

	doConsultationInfinite(infiniteScroll) {
		this.consultationIndex++;
		this.loadConsultationList(this.consultationIndex ,infiniteScroll,this.searchValue );
	}	


	goToConsultationProfile(item: any) {
	    this.navCtrl.push(ConsultationProfilePage, { userTitle: item.pn_name ,uid: item.uid});
	}
		
	onSearchCancel(ev: any){
		this.consultationIndex = 0;
		this.loadConsultationList(this.consultationIndex);
	}	
	
	onInput(ev: any ){
		let val = ev.target.value;
		if (val && val.trim() != '') {
			this.consultationIndex = 0;
			this.searchValue = ev.target.value;
			this.loadConsultationList(this.consultationIndex ,null ,this.searchValue );
		}else{
			this.consultationIndex = 0;
			this.searchValue = null;
			this.loadConsultationList(this.consultationIndex );
		}
	}
	
	discountsList(index ,infiniteScroll = null){
		  if( index == 0  ){
			  this.discountIndex = 0;
			  this.discountLastIndex = false;
		  }
		  else if( this.discountLastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }
		  
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						if( index == 0)
							this.dialog.createDefaultLoading();
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=marketing&Op=userDiscountList&token='+token['token']+'&index='+index; 
						 this.http.get(url)
							 .map(res => res.json())
							 .subscribe(data => {
 								 this.errorCode = data.code;
								 this.errorMessage = data.message;
									if(this.errorCode != 1){
										this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
									}else{
											if( index == 0){
												this.discountItems = data.items;
											}
											else{
												if(data.items.length == 0)
													this.discountLastIndex = true;
												var arr2 = this.discountItems.concat( data.items );
												this.discountItems = arr2;
												infiniteScroll.complete();
											}							
									}						 
									if( index == 0)
										this.dialog.closeDelayLoading(1500);
								 },error=>{
									if( index == 0)
										this.dialog.closeLoading();		
									console.log(error);// Error getting the data
									this.dialog.showError('خطا در دريافت اطلاعات');
								});		


				}else{
					this.events.publish( 'user:mustLogin' );		
				}
		});	
	}

	doDiscountsInfinite(infiniteScroll) {
		this.discountIndex++;
		this.discountsList(this.discountIndex ,infiniteScroll);
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

discountCode() {
		let prompt = this.alertCtrl.create({
		  title: 'ثبت کد معرف و دريافت تخفیف',
		  inputs: [
			{
			  name: 'name',
			  placeholder: 'کد معرف'
			},
		  ],
		  buttons: [
			{
			  text: 'لغو',
			  handler: data => {
				console.log('Cancel clicked');
			  }
			},
			{
			  text: 'ذخیره',
			  handler: data => {
				  this.submitDiscountCode(data.name);
				console.log('Saved clicked');
			  }
			}
		  ]
		});
		prompt.present();
	  }		
	  	
	submitDiscountCode( code : any ){
		this.dialog.createDefaultLoading();
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=marketing&Op=submitDiscountCode&discountCode='+code+'&token='+token['token']; 
				 this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
							 this.errorCode = data.code;
							 this.errorMessage = data.message;
							 if(this.errorCode != 1)
								this.dialog.raiseError(this.errorMessage,this.errorCode,2702);	
							 else{
								this.dialog.showMessage('کد تخفیف با موفقیت ثبت شد');
								this.discountsList(0);
							 }
							this.dialog.closeLoading();		
						 },error=>{
							console.log(error);// Error getting the data
							this.dialog.showError('خطا در دريافت اطلاعات');
							this.dialog.closeLoading();		
						});
			}else{
				this.app.getRootNav().setRoot(LoginPage);
			}
		});		
	}
	
	notificationsList(index ,infiniteScroll = null){
		  if( index == 0  ){
			  this.notIndex = 0;
			  this.notLastIndex = false;
		  }
		  else if( this.notLastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }
		  
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						if( index == 0)
							this.dialog.createDefaultLoading();
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=question&Op=notifications&index='+index+'&token='+token['token']; 
						this.http.get(url)
							 .map(res => res.json())
							 .subscribe(data => {
 								 this.errorCode = data.code;
								 this.errorMessage = data.message;
									if(this.errorCode != 1){
										this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
									}else{
											if( index == 0){
												this.notItems = data.items;
											}
											else{
												if(data.items.length == 0)
													this.notLastIndex = true;
												var arr2 = this.notItems.concat( data.items );
												this.notItems = arr2;
												infiniteScroll.complete();
											}							
									}						 
									if( index == 0)
										this.dialog.closeDelayLoading(1500);
								 },error=>{
									if( index == 0)
										this.dialog.closeLoading();		
									console.log(error);// Error getting the data
									this.dialog.showError('خطا در دريافت اطلاعات');
								});		


				}else{
					this.events.publish( 'user:mustLogin' );		
				}
		});	
	}
	
	doNotInfinite(infiniteScroll) {
		this.notIndex++;
		this.notificationsList(this.notIndex ,infiniteScroll);
	}
	
	goToNotification(notItem){
		if( notItem.text > '' || notItem.img > ''){
			let modal = this.modalCtrl.create( NotificationPage ,{ id: notItem.nti_id });
			modal.present();	
		}
	}
	
}
