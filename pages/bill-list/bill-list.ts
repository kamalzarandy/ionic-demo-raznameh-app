import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';
import { Http } from '@angular/http';

import { DialogProvider } from '../../providers/dialog/dialog';
import { SettingProvider } from '../../providers/setting/setting';
import { SessionProvider } from '../../providers/session/session';
import { Events } from 'ionic-angular';


/**
 * Generated class for the BillListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bill-list',
  templateUrl: 'bill-list.html',
})
export class BillListPage {
	billList: any;
	errorCode: any;
	errorMessage: any;   
	public index: any;   
	public lastIndex: any;   

  constructor(
				public events:Events,
				public session:SessionProvider,
				public http:Http,
				public dialog:DialogProvider,
				public setting:SettingProvider,
  				public viewCtrl: ViewController,
				public navCtrl: NavController, public navParams: NavParams) {
	    this.index = 0;
	    this.lastIndex = false;
					
  }

  ionViewDidLoad() {
	  this.loadBillList(0);
    console.log('ionViewDidLoad BillListPage');
  }

  
  	dismiss() {
		this.viewCtrl.dismiss(false);
	}  
	
    loadBillList( index ,infiniteScroll = null){
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
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payment&Op=paymentList&index='+index+'&token='+token['token']; 
					 this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
							 this.errorCode = data.code;
							 this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
								}else{
										if( index == 0){ 
											this.billList = data.payList;
										}
										else{
											if(data.payList.length == 0)
												this.lastIndex = true;
											var arr2 = this.billList.concat( data.payList );
											this.billList = arr2;
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
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});
	  }  	
	  
	doInfinite(infiniteScroll) {
		this.index++;
		this.loadBillList(this.index ,infiniteScroll);
	}
	
	doRefresh(refresher) {
		console.log('Begin async operation', refresher);
		 this.index = 0;
		 this.loadBillList(0);
		  refresher.complete();
	}	  
}
