import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,App} from 'ionic-angular';
import { Http } from '@angular/http';
import { ModalController } from 'ionic-angular';

import { ConsultationProfilePage } from '../consultation-profile/consultation-profile';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SettingProvider } from '../../providers/setting/setting';

import { MakeFreeQuestionPage } from '../make-free-question/make-free-question';
import { MakeconsultationPage } from '../makeconsultation/makeconsultation';
import { MakeQuestionWarningPage } from '../make-question-warning/make-question-warning';

//error 1300
/**
 * Generated class for the ConsultationListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

  export interface  itemClass{
	small_image : any;
} 

 
 
@IonicPage()
@Component({
  selector: 'page-consultation-list',
  templateUrl: 'consultation-list.html',
})


export class ConsultationListPage {
  public pageTitle : any;
  public cls_id : any;
	ConsultationList: any;
	errorCode: any;
	errorMessage: any;   
	public index: any;   
	public lastIndex: any;   
	public item : itemClass={small_image : "../../assets/img/unknown300.jpg"};
	public searchValue : any;
  constructor(
				public setting:SettingProvider,
				public navCtrl: NavController, 
				public app:App,
				public http:Http,
				public dialog:DialogProvider,
				public modalCtrl: ModalController, 
				public navParams: NavParams) 
	{
	  	this.pageTitle = navParams.get("title");
	    this.cls_id = navParams.get("cls_id");
	    this.index = 0;
		//alert('constru   cons list');
  }
 
      loadConsultationList( index ,infiniteScroll = null ,searchValue = null){
		  if( index == 0  )
			  this.lastIndex = false;
		  else if( this.lastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }
		  
		  if(this.cls_id > ''){
				if( index == 0)
					this.dialog.createDefaultLoading();
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=consultation&Op=consultation_list&category='+this.cls_id+'&index='+index; 
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
											this.lastIndex = true;
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
	  }  
	goToConsultationProfile(item: any) {
	    this.navCtrl.push(ConsultationProfilePage, { userTitle: item.pn_name ,uid: item.uid});
	}
	ngOnInit(){
		//alert('ngOnInit cons list');
		console.log('ionViewDidLoad ConsultationListPage');
		this.loadConsultationList( 0);
		this.index = 0;
		//this.dialog.closeLoading();		
	}
	doInfinite(infiniteScroll) {
		this.index++;
		this.loadConsultationList(this.index ,infiniteScroll);
	}
	
	doRefresh(refresher) {
		console.log('Begin async operation', refresher);
		 this.index = 0;
		 this.loadConsultationList(0);
		  refresher.complete();
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
	
	onInput(ev: any ){
		let val = ev.target.value;
		if (val && val.trim() != '') {
			this.index = 0;
			this.searchValue = ev.target.value;
			this.loadConsultationList(this.index ,null ,this.searchValue );
		}else{
			this.index = 0;		
			this.loadConsultationList(this.index );
		}
	}	
	onCancel(){
		this.index = 0;		
		this.loadConsultationList(this.index );
	}	
}
