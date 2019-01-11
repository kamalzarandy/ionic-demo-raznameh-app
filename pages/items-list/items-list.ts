import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,App} from 'ionic-angular';
import { Http } from '@angular/http';

import { ViewItemPage } from '../view-item/view-item';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SettingProvider } from '../../providers/setting/setting';
//1700
@IonicPage({
  segment: 'session/:sessionId'
})

@Component({
  selector: 'page-items-list',
  templateUrl: 'items-list.html',
})
export class ItemsListPage {
	
  public pageTitle : any;
  public conTypeTitle : any;
  public cls_id : any;
  public categoryType : any;
  itemsList: any;
  errorCode: any;
  errorMessage: any;   
  public index : any;
	public lastIndex: any;   
  
  constructor(
				public setting:SettingProvider,
				public navCtrl: NavController, 
				public app:App,
				public http:Http,
				public dialog:DialogProvider,
				public navParams: NavParams) 
	{
	  	this.pageTitle = navParams.get("title");
	    this.cls_id = navParams.get("cls_id");
	    this.categoryType = navParams.get("categoryType");
		this.index = 0;
		if(this.categoryType == 'content_faq')
			this.conTypeTitle = ' مشاوره : ';
		else if (this.categoryType == 'content_news')
			this.conTypeTitle = ' اخبار : ';
		else if (this.categoryType == 'article')
			this.conTypeTitle = ' مقالات : ';
		else if (this.categoryType == 'content_files')
			this.conTypeTitle = 'فايلها:';
		else if (this.categoryType == 'content_role')
			this.conTypeTitle = 'قوانین:';
		//alert('constru   cons list');
  }

	ionViewWillEnter() {
		//alert('ionViewWillEnter');

	}
	ionViewDidLoad(){
	}
  
      loadItemList(){
		  if(this.cls_id > ''){
				this.dialog.createDefaultLoading();
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=item&Op=itemList&cls_id='+this.cls_id+'&content_type='+this.categoryType; 
				//alert(url);
				 this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
						 this.itemsList = data.items;
						 this.errorCode = data.code;
						 this.errorMessage = data.message;
						 if(this.errorCode != 1)
							this.dialog.raiseError(this.errorMessage,this.errorCode,1700);
						 //alert(this.categoryList);
						this.dialog.closeDelayLoading(1500);		
						 },error=>{
							this.dialog.closeLoading();		
							console.log(error);// Error getting the data
							this.dialog.showError('خطا در دريافت اطلاعات');
						});
			}
	  }  
	goToItemView(item: any) {
	    this.navCtrl.push(ViewItemPage, { pageTitle: item.user_title ,itmId: item.prt_itm_id});
	}
	ngOnInit(){
		//alert('ngOnInit cons list');
		console.log('ionViewDidLoad ConsultationListPage');
		this.loadItemList();		
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
		  
			this.index ++;
			var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=item&Op=itemList&cls_id='+this.cls_id+'&content_type='+this.categoryType+'&index='+this.index; 
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
							this.dialog.showError('خطا در دريافت اطلاعات');
						 //alert(this.categoryList);
						 },error=>{
							console.log(error);// Error getting the data
							this.dialog.showError('خطا در دريافت اطلاعات');
						});
  }
	
		
}