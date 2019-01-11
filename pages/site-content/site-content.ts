import { Component } from '@angular/core';
import { Http } from '@angular/http';
import {   NavController } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';


//import { ConsultationListPage } from '../consultation-list/consultation-list';
//import { ItemsListPage } from '../items-list/items-list';
import { CategoryTypePage } from '../category-type/category-type';
import { ViewItemPage } from '../view-item/view-item';

 //2500
//import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';


//import { SessionDetailPage } from '../session-detail/session-detail';
//import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';


@Component({
  selector: 'page-site-content',
  templateUrl: 'site-content.html'
})
export class siteContent {
	
	siteContentNav: string = "siteContent";
	categoryList: any;
	errorCode: any;
	errorMessage: any;  
	itemsList: any;
	public index : any;
	public lastIndex: any;   
	public indexSearch : any;
	public lastIndexSearch: any;   
	public searchValue : any;
	public searchItems : any;
	
	constructor(  
				public events:Events,
				public session:SessionProvider,
				public setting:SettingProvider,
		public http:Http,
		public dialog:DialogProvider,
		public navCtrl: NavController,	
	) {
		this.index = 0;		
		this.indexSearch = 0;		
		this.searchValue = '';		
		//alert('constructor  consultation');
		
	}
	
	
	doRefresh(refresher) {
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
		this.loadCategory(2);
	}  
	
	ionViewDidLeave() {
	}  
	
	ngOnInit(){
		//alert('ngOnInit consultation');
		//this.loadCategory(1);
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
					this.dialog.raiseError(this.errorMessage,this.errorCode,2500);
				});
		this.dialog.closeLoading();		
	}  
	goToCategoryListPage(item: any) {
		this.navCtrl.push(CategoryTypePage, { title: item.title ,cls_id: item.cls_id});
	}
	
	
	
      loadContentList( index ,infiniteScroll=null ){
		  if( index == 0  )
			  this.lastIndex = false;
		  else if( this.lastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }
		  
		  
		  
			if( index == 0)
				this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userFavorite&Op=userFavoriteContent&index='+index+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode,2501);
								}else{
									if( index == 0)
										this.itemsList = data.items;
									else{
										if(data.items.length == 0)
											this.lastIndex = true;
										
										var arr2 = this.itemsList.concat( data.items );
										this.itemsList = arr2;
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
	
	myFavoritesSelect(){
  		this.index = 0;
		this.loadContentList(0);
	}
	
	doInfiniteFavorites(infiniteScroll) {
		this.index++;
		this.loadContentList(this.index ,infiniteScroll);
	}	
	goToItemView(item: any) {
	    this.navCtrl.push(ViewItemPage, { pageTitle: item.user_title ,itmId: item.prt_itm_id});
	}	
	
	removeItem(post){
		let index = this.itemsList.indexOf(post);
		this.removeToFavorite(post);
		if(index > -1){
		  this.itemsList.splice(index, 1);
		}
	}	
	
	removeToFavorite( record ){
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userFavorite&Op=userFavoriteRemove&contentType=1&itmId='+record.prt_itm_id+'&token='+token['token']; 
					this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
							this.errorCode = data.code;
							this.errorMessage = data.message;
							if(this.errorCode != 1){
								this.dialog.raiseError(this.errorMessage,this.errorCode,2502);
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
//---------------------------------------------
	onInput(ev: any ){
		let val = ev.target.value;
		if (val && val.trim() != '') {
			this.indexSearch = 0;
			this.searchValue = ev.target.value;
			this.searchItem(this.indexSearch ,this.searchValue );
		}else
			this.searchValue = '';
	}	
	onCancel(){
	}
	
	searchItem(index ,search ,infiniteScroll=null){
		if(search <= '') 
			return;
		
		  if( index == 0  )
			  this.lastIndexSearch = false;
		  else if( this.lastIndexSearch == true ){
			  infiniteScroll.complete();
			  return;
		  }
		  		
		
			if( index == 0)
				this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=item&Op=searchItem&search='+search+'&index='+index+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode,2503);
								}else{
									if( index == 0){
										this.searchItems = data.items;
									}
									else{
										if(data.items.length == 0)
											this.lastIndexSearch = true;
										
										var arr2 = this.searchItems.concat( data.items );
										this.searchItems = arr2;
										if(infiniteScroll > '' && infiniteScroll != null)
											infiniteScroll.complete();
									}
									 this.errorCode = data.code;
									 this.errorMessage = data.message;							
								}
								if( index == 0)
									this.dialog.closeLoading();		
							 },error=>{ 
								console.log('خطا در دريافت اطلاعات');// Error getting the data
								this.dialog.showError(error);
								if( index == 0)
									this.dialog.closeLoading();		
							});					
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});
	}
	
	doInfiniteSearch(infiniteScroll) {
		this.indexSearch++;
		this.searchItem(this.indexSearch ,this.searchValue ,infiniteScroll);
	}	
}
