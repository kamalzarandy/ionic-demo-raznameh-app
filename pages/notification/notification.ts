import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';

import { ModalController } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';
import { SettingProvider } from '../../providers/setting/setting';
import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { PhotoViewer } from '@ionic-native/photo-viewer';



/**
 * Generated class for the NotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
    
	public id: any;
	public item: any;
	public output: any;
	public errorCode: any;
	public errorMessage: any; 
  constructor(
				private photoViewer: PhotoViewer,
				public http:Http,
				public events:Events,
				public session:SessionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public navCtrl: NavController, 
				public viewCtrl: ViewController,
				public navParams: NavParams) {
	  	this.id = navParams.get("id");
				
  }


  	dismiss() {
		this.viewCtrl.dismiss(false);
	}
  
	ionViewDidLoad(){
		console.log('ionViewDidLoad NotificationPage');
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					this.dialog.createDefaultLoading();
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=question&Op=notificationSpecification&id='+this.id+'&token='+token['token']; 
					this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
							 this.errorCode = data.code;
							 this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
								}else{
									this.item = data.item;
									this.output = data.item.text
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
	
	showImage(item){
		this.photoViewer.show(item.image, '', {share: true});

	}	
}
