import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http ,RequestOptions } from '@angular/http';
import { Events } from 'ionic-angular';



import { DialogProvider } from '../../providers/dialog/dialog';
import { SettingProvider } from '../../providers/setting/setting';

import { ConsultationProfilePage } from '../consultation-profile/consultation-profile';
import { SessionProvider } from '../../providers/session/session';
//2800
/**
 * Generated class for the ViewItemPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

export interface  itemClass{
	small_image : any;
} 
 
 
@IonicPage()
@Component({
  selector: 'page-view-item',
  templateUrl: 'view-item.html',
})
export class ViewItemPage {

	//public record : itemClass={small_image : "assets/img/unknown80.jpg"};
	public record : any;
	public pageTitle : any;
	public itmId : any;
	public content : any;
	public comments : any;
	public contentText : any;
	public contentType : any;
	public is_consultation : any;
	public commentLength : any;
	errorCode: any;
	errorMessage: any;   
  constructor(	public navCtrl: NavController, 
				public http:Http,
				public events:Events,
				public session:SessionProvider,
				public RequestOptions:RequestOptions,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public navParams: NavParams) {
					
	  	this.pageTitle = navParams.get("pageTitle");
	    this.itmId = navParams.get("itmId");						
	    this.commentLength = 0;						
  }

    ionViewDidLoad() {
		this.loadItem();
		console.log('ionViewDidLoad ViewItemPage');
	} 
	
    loadItem(){
		this.dialog.createDefaultLoading();
		var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=item&Op=itemView&itmId='+this.itmId; 
		//alert(url);
		 this.http.get(url)
			 .map(res => res.json())
			 .subscribe(data => {
				 this.errorCode = data.code;
				 this.errorMessage = data.message;
				 this.record = data.portal;
				 this.content = data.item;
				 this.comments = data.comments;
				 this.commentLength = this.comments.length;
				 this.contentText = data.item.lang_far_text;
				 this.contentType = data.portal.mod_section_name;
				 this.is_consultation = data.portal.is_consultation;
				 this.pageTitle = data.portal.lang_far_title;
				 if(this.errorCode != 1)
						this.dialog.raiseError(this.errorMessage,this.errorCode,2800);
				this.dialog.closeDelayLoading(1000);		
				 },error=>{
					this.dialog.closeLoading();
					console.log(error);// Error getting the data
					this.dialog.showError('خطا در دريافت اطلاعات');
				});
	}
	goToConsultationProfile(item: any) {
			this.navCtrl.push(ConsultationProfilePage, { userTitle: item.lang_far_title ,uid: item.uid});
	}
	addToFavorite( record ){
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userFavorite&Op=userFavoriteAdd&contentType=1&itmId='+record.prt_itm_id+'&token='+token['token']; 
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
								this.dialog.raiseError(this.errorMessage,this.errorCode,2801);
							}else{
								this.dialog.showMessage('محتوا به لیست علاقه منديها اضافه شد');
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
}
