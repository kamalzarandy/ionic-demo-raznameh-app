import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,App} from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';

import { ViewItemPage } from '../view-item/view-item';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SettingProvider } from '../../providers/setting/setting';
import { SessionProvider } from '../../providers/session/session';
//error  1200
/**
 * Generated class for the ConsultationActivityPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-consultation-activity',
  templateUrl: 'consultation-activity.html',
})
export class ConsultationActivityPage {
	
	public consultationImage : any;
	public consultationName : any;
	public consultationTitle : any;
	public listType : any;
	public uid : any;
	public index : any;
	public lastIndex: any;   	
	public errorCode: any;
	public errorMessage: any;  
	public itemsList: any;  
	public pageTitle: any;  

  constructor(public setting:SettingProvider,
				public navCtrl: NavController, 
				public app:App,
				public http:Http,
				public dialog:DialogProvider,
				public navParams: NavParams,
				public events:Events,
				public session:SessionProvider,
			) {
  	  	this.consultationImage = navParams.get("consultationImage");
	  	this.consultationName = navParams.get("consultationName");
	  	this.consultationTitle = navParams.get("consultationTitle");
	  	this.listType = navParams.get("listType");
	  	this.uid = navParams.get("uid");
		this.index = 0;
		if(this.listType == 1)
			this.pageTitle = 'مطالب ثبت شده توسط '+this.consultationName ;
		else
			this.pageTitle = 'مشاوره های انجام شده توسط '+this.consultationName ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsultationActivityPage');
  }

    loadItemList(index ,infiniteScroll=null){
		  if( index == 0  )
			  this.lastIndex = false;
		  else if( this.lastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }		
		
			if( index == 0)
				this.dialog.createDefaultLoading();
			var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=item&Op=userContetList&contentType='+this.listType+'&index='+index+'&uid='+this.uid; 
			this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
					this.errorCode = data.code;
					this.errorMessage = data.message;
					if(this.errorCode != 1){
						this.dialog.raiseError(this.errorMessage,this.errorCode ,1200);
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
					}
					if( index == 0)
						this.dialog.closeLoading();		
				 },error=>{ 
					console.log(error);// Error getting the data
					this.dialog.showError('خطا در دريافت اطلاعات');
					if( index == 0)
						this.dialog.closeLoading();								
			});
	}  
	
	goToItemView(item: any) {
	    this.navCtrl.push(ViewItemPage, { pageTitle: item.user_title ,itmId: item.prt_itm_id});
	}
	
	ngOnInit(){
  		this.index = 0;
		console.log('ionViewDidLoad ConsultationListPage');
		this.loadItemList(this.index);		
	}
	

	doInfiniteFavorites(infiniteScroll) {
		this.index++;
		this.loadItemList(this.index ,infiniteScroll);
	}	
  	doRefresh(refresher) {
		//alert('doRefresh');
		console.log('Begin async operation', refresher);
		  this.loadItemList( 0 );
		  refresher.complete();
		  this.index = 0;
	}	
}
