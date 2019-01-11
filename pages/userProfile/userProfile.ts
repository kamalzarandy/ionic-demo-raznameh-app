import { Component } from '@angular/core';
import {  NavController ,App} from 'ionic-angular';
import {  ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { Events } from 'ionic-angular';


import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
//import { SocialSharing } from 'ionic-native';
import { SocialSharing } from '@ionic-native/social-sharing';

import { LoginPage } from '../../pages/login/login';

import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';
import { ConversionProvider } from '../../providers/conversion/conversion';

import { IntroductionPage } from '../introduction/introduction';
import { BillListPage } from '../bill-list/bill-list';
import { PayPage } from '../pay/pay';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

//2700
//import { AlertController, App, FabContainer, ItemSliding, List, ModalController, NavController, ToastController, LoadingController, Refresher } from 'ionic-angular';

/*
  To learn how to use third party libs in an
  Ionic app check out our docs here: http://ionicframework.com/docs/v2/resources/third-party-libs/
*/
// import moment from 'moment';


//import { SessionDetailPage } from '../session-detail/session-detail';
//import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';


@Component({
  selector: 'page-userProfile',
  templateUrl: 'userProfile.html'
})
export class userProfile {

 userPageNav: string = "userAccount";
	errorCode: any;
	errorMessage: any;  
	userProfile: any; 
	sexuality: any; 
	small_image: any; 
	sendNews: any; 
	sendSmsNews: any; 
 
	lastImage: string = null;
	loading: Loading;
	public token: any;
    public base64Image: any;
    public progressValue: any;
    public payList: any;
    public index: any;
    public lastIndex: any;
    public userList: any;
    public userCode: any;
    public itemCount: any;

 
  constructor(
				private sharing: SocialSharing, 
				public modalCtrl: ModalController, 
				public conversion:ConversionProvider,
				public setting:SettingProvider,
				public dialog:DialogProvider,
				public session:SessionProvider,
				public navCtrl : NavController,
				public http : Http,
				public alertCtrl : AlertController,
				public app : App,
				public events:Events,
				
				private camera: Camera,
				private transfer: Transfer, 
				private file: File, 
				private filePath: FilePath, 
				public actionSheetCtrl: ActionSheetController, 
				public toastCtrl: ToastController, 
				public platform: Platform, 
				public loadingCtrl: LoadingController,
  ) {
	  
	  this.progressValue = 0;
  }

  logoutProgram(){
		this.session.logout();
		this.app.getRootNav().setRoot(LoginPage);
  }
  
   loadUserProfile(){
		this.dialog.createDefaultLoading();
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
			this.token = token['token'];
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=getUserInfo&token='+token['token']; 
				 this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
						 this.errorCode = data.code;
						 this.errorMessage = data.message;
						if(this.errorCode != 1){
							this.dialog.raiseError(this.errorMessage,this.errorCode ,2701);								
						}else{

							 this.userProfile = data.userInfo;
							 this.small_image = this.userProfile.small_image;
							 if(this.userProfile.sex == 1)
								 this.sexuality = 'مرد';
							 else if(this.userProfile.sex == 2)
								 this.sexuality = 'زن';
							 else if(this.userProfile.sex == 3)
								 this.sexuality = 'دو جنسیتی';
							 else
								 this.sexuality = '';
							 if(this.userProfile.email_newsletter == 1)
								 this.sendNews = true;
							 else
								 this.sendNews = false;
							 if(this.userProfile.sms_newsletter == 1)
								 this.sendSmsNews = true;
							 else
								 this.sendSmsNews = false;
						}
						this.dialog.closeDelayLoading(1000);		
						 },error=>{
							console.log(error);// Error getting the data
							this.dialog.closeLoading();		
							this.dialog.showError('خطا در دريافت اطلاعات');
						});
			}else{
				this.app.getRootNav().setRoot(LoginPage);
			}
		});
   }
	   
	updateUserInfo( itemType , value){
		this.session.getUserToken().then((token) => {
			if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
				var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=updateUserInfo&itemType='+itemType+'&value='+value+'&token='+token['token']; 
				 this.http.get(url)
					 .map(res => res.json())
					 .subscribe(data => {
						 this.errorCode = data.code;
						 this.errorMessage = data.message;
						 if(this.errorCode != 1)
							this.dialog.raiseError(this.errorMessage,this.errorCode,2702);	
						 else
					 		this.loadUserProfile();
						 },error=>{
							console.log(error);// Error getting the data
							this.dialog.showError('خطا در دريافت اطلاعات');
						});
			}else{
				this.app.getRootNav().setRoot(LoginPage);
			}
		});
   }
	
	ionViewWillEnter() {
		this.loadUserAccount();
	}  
		
	setUserName() {
		let prompt = this.alertCtrl.create({
			cssClass : 'alertcontroll',
		  title: 'ورود نام  و نام خانوادگی',
		  inputs: [
			{
			  name: 'name',
			  placeholder: 'نام و نام خانوادگی'
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
				  this.updateUserInfo(1 ,data.name);
				console.log('Saved clicked');
			  }
			}
		  ]
		});
		prompt.present();
	  }		
	discountCode() {
		let prompt = this.alertCtrl.create({
			cssClass : 'alertcontroll',
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
	  
	  setEmail() {
		let prompt = this.alertCtrl.create({
			cssClass : 'alertcontroll',
		  title: 'ورود پست الکترونیکی',
		  inputs: [
			{
			  name: 'name',
			  placeholder: 'پست الکترونيک'
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
				  this.updateUserInfo(2 ,data.name);
				console.log('Saved clicked');
			  }
			}
		  ]
		});
		prompt.present();
	  }			
	setSex() {
		    let alertcom = this.alertCtrl.create();
			alertcom.setTitle('جنسیت');

			alertcom.addInput({
			  type: 'radio',
			  label: 'مرد',
			  value: '1',
			  checked: false
			});
			alertcom.addInput({
			  type: 'radio',
			  label: 'زن',
			  value: '2',
			  checked: false
			});
			alertcom.addInput({
			  type: 'radio',
			  label: 'دوجنسیتی',
			  value: '3',
			  checked: false
			});
			alertcom.addButton('لغو');
			alertcom.addButton({
			  text: 'ذخیره',
			  handler: data => {
				this.updateUserInfo(3 ,data);
			  }
			});
			alertcom.present();
	  }		
	  setBirthDate() {
		let prompt = this.alertCtrl.create({
			cssClass : 'alertcontroll',
		  title: 'ورود تاريخ تولد',
		  inputs: [
			{
			  name: 'year',
			  placeholder: 'سال چهار رقمی باشد'
			},
			{
			  name: 'month',
			  placeholder: 'ماه'
			},
			{
			  name: 'day',
			  placeholder: 'روز'
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
				 data.year =  this.conversion.englishNumber(data.year);
				 data.month =  this.conversion.englishNumber(data.month);
				 data.day =  this.conversion.englishNumber(data.day);
				 
				if(data.year < 1300 ||  data.year > 1420)
					this.dialog.showError('سال نا معتبر می باشد مجدد وارد نماييد');
				else if(data.month < 1 ||  data.month > 12)
					this.dialog.showError('ماه نا معتبر می باشد مجدد وارد نماييد');
				else if(data.day < 1 ||  data.month > 31)
					this.dialog.showError('روز نا معتبر می باشد مجدد وارد نماييد');
				else{
					if(data.month.length == 1 )
						data.month = '0'+data.month;
					if(data.day.length == 1 )
						data.day = '0'+data.day;
					this.updateUserInfo(4 ,data.year+'-'+data.month+'-'+data.day);
				}			  
				console.log('Saved clicked');
			  }
			}
		  ]
		});
		prompt.present();
	  }		
	showIntroduction(){ 
			this.session.getUserToken().then((token) => {
				if( token['token'] > ''){ 
					let modal = this.modalCtrl.create(IntroductionPage,{ formType: 1 });
					modal.present();	
				}					
			});					  
	}
	  	
	showHelp(){ 
			this.session.getUserToken().then((token) => {
				if( token['token'] > ''){ 
					let modal = this.modalCtrl.create(IntroductionPage,{ formType: 3 });
					modal.present();	
				}					
			});					  
	}
	  
	  
	shareRecipe() {
		
		this.sharing.share("اپلیکیشن مشاوره رازنامه", "در اسرع وقت به خدمات مشاوره دسترسی داشته باشید", "", "\n http://raznameh.com/app \n\n https://play.google.com/store/apps/details?id=raznameh.user.app \n\n http://cafebazaar.ir/app/?id=raznameh.user.app&ref=share").
		//this.sharing.share("اپلیکیشن مشاوره رازنامه", "در اسرع وقت به خدمات مشاوره دسترسی داشته باشید", "", "\n\n http://cafebazaar.ir/app/?id=raznameh.user.app&ref=share").
			then(() => {
				//alert("Sharing success");
			// Success!
			}).catch(() => {
			// Error!
			//alert("Share failed");
			this.dialog.showError('خطا در به اشتراک گذاری  ');
		});		
		
	}
	
	sendNewsChange(value){
		this.updateUserInfo(5 ,value);			
	}
		
	sendSmsNewsChange(value){
		this.updateUserInfo(6 ,value);
	}
		
	showVersion(){
		this.dialog.showMessage(this.setting.version ,'نگارش برنامه');
	}
/*
	imageUploader1(){
		this.takePicture();
	}
	
	takePicture(){
		
		
		this.camera.getPicture({
			destinationType: this.camera.DestinationType.DATA_URL,
			targetWidth: 1000,
			targetHeight: 1000
		}).then((imageData) => {
		  // imageData is a base64 encoded string
			this.base64Image = "data:image/jpeg;base64," + imageData;
			alert('ok');
		}, (err) => {
						alert(err);

			console.log(err);
		});
	}
	*/
	
	public presentActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
		  title: 'بارگذاری تصوير',
		  cssClass: 'alertcontroll',
		  buttons: [
			{
			  text: 'انتخاب از گالری تصاوير',
			  handler: () => {
				this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
			  }
			},
			{
			  text: 'گرفتن تصوير با دوربین',
			  handler: () => {
				this.takePicture(this.camera.PictureSourceType.CAMERA);
			  }
			},
			{
			  text: 'لغو',
			  role: 'cancel'
			}
		  ]
		});
		actionSheet.present();
	}

	public takePicture(sourceType) {
		  this.progressValue = 0;

		  // Create options for the Camera Dialog
		  var options = {
			quality: 100,
			targetWidth:700,
			targetHeight:700,
			sourceType: sourceType,
			saveToPhotoAlbum: false,
			correctOrientation: true,
		  };
		 
		  // Get the data of an image
		  this.camera.getPicture(options).then((imagePath) => {
				// Special handling for Android library
				if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
				  this.filePath.resolveNativePath(imagePath)
					.then(filePath => {
					  let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
					  let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
					  this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then((value) => {
																							if(value == true){
																								this.small_image = this.pathForImage(this.lastImage);
																								this.uploadImage();
																							}else{
																									}
																							});
					});
				} else {
				  var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
				  var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
				  this.copyFileToLocalDir(correctPath, currentName, this.createFileName()).then((value) => {
																							if(value == true){
																								this.small_image = this.pathForImage(this.lastImage);
																								this.uploadImage();
																							}else{
																									}
																							});
				}
		  }, (err) => {
			this.presentToast('خطا در انتخاب تصوير');
		  });
	}

	private createFileName() {
		  var d = new Date(),
		  n = d.getTime(),
		  newFileName =  n + ".jpg";
		  return newFileName;
	}
 
// Copy the image to a local folder
	copyFileToLocalDir(namePath, currentName, newFileName) : Promise<boolean>{
			return this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
					this.lastImage = newFileName;
					return true;
			  }, error => {
					this.presentToast('Error while storing file.'+error);
					return  false;
			  });
		}
	 
	private presentToast(text) {
		  let toast = this.toastCtrl.create({
			message: text,
			duration: 3000,
			position: 'top'
		  });
		  toast.present();
	}
 
	// Always get the accurate path to your apps folder
	public pathForImage(img) {
		  if (img === null) {
			return '';
		  } else {
			return cordova.file.dataDirectory + img;
		  }
	}

	public uploadImage() {
		  // Destination URL
		  var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=userRegister&Op=uploadImage&token='+this.token; 
		 
		  // File for Upload
		  var targetPath = this.pathForImage(this.lastImage);
		 
		  // File name only
		  var filename = this.lastImage;
		 
		  var options = {
			fileKey: "file", 
			fileName: filename,
			chunkedMode: false,
			mimeType: "multipart/form-data",
			params : {'fileName': filename}
		  };
		 
		  const fileTransfer: TransferObject = this.transfer.create();
		  
		  
//		  fileTransfer.onProgress(listener)
fileTransfer.onProgress((e) => {
     //this.progressValue = (e.lengthComputable) ?  Math.floor(e.loaded / e.total * 100) : -1;
	//this.loading.setContent(this.progressValue+' - '+e.loaded);	 
	//this.progressValue = e.loaded;
});
		 
		  this.loading = this.loadingCtrl.create({
			content: 'در حال بارگزاری ...',
		  });
		  this.loading.present();
		 
		  // Use the FileTransfer to upload the image
		  fileTransfer.upload(targetPath, url, options).then(data => {
			 let result = JSON.parse(data.response);
			 this.errorCode = result.code;
			 this.errorMessage = result.message;			  
			this.loading.dismissAll()
			this.presentToast('تصوير با موفقیت بارگزاری شد');
		  }, err => {
			this.loading.dismissAll()
			this.presentToast('خطا در بارگزاری تصویر');
		  });
	}
	rateApp(){
	}
	//--------------------------------------------
	
	loadUserAccount( ){
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
					var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payment&Op=accountBalance&token='+token['token']; 
					 this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
							 this.errorCode = data.code;
							 this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
								}else{
									this.payList = data.payList;
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
	
	
	
	payMoney(){
		this.session.getUserToken().then((token) => {
			if( token['token'] > ''){ 
				let modal = this.modalCtrl.create(PayPage);
				modal.present();	
			}					
		});				
	}
	
	billList(){
		this.session.getUserToken().then((token) => {
			if( token['token'] > ''){ 
				let modal = this.modalCtrl.create(BillListPage);
				modal.present();	
			}					
		});		
	}
	
	userIncome(index ,infiniteScroll = null){
		  if( index == 0  ){
			  this.index = 0;
			  this.lastIndex = false;
		  }
		  else if( this.lastIndex == true ){
			  infiniteScroll.complete();
			  return;
		  }
		  
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						if( index == 0)
							this.dialog.createDefaultLoading();
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=marketing&Op=userIncomeList&token='+token['token']+'&index='+index; 
						 this.http.get(url)
							 .map(res => res.json())
							 .subscribe(data => {
 								 this.errorCode = data.code;
								 this.errorMessage = data.message;
									if(this.errorCode != 1){
										this.dialog.raiseError(this.errorMessage,this.errorCode ,1300);
									}else{
											if( index == 0){
												this.userList = data.items;
												this.userCode = data.userCode;
												this.itemCount = data.itemCount;
											}
											else{
												if(data.items.length == 0)
													this.lastIndex = true;
												var arr2 = this.userList.concat( data.items );
												this.userList = arr2;
												infiniteScroll.complete();
											}							
									}						 
									if( index == 0)
										this.dialog.closeDelayLoading(1500);
								 },error=>{
									if( index == 0)
										this.dialog.closeLoading();		
									console.log(error);
									this.dialog.showError('خطا در دريافت اطلاعات');
								});		


				}else{
					this.events.publish( 'user:mustLogin' );		
				}
		});		
	}
	
	doInfinite(infiniteScroll) {
		this.index++;
		this.userIncome(this.index ,infiniteScroll);
	}	
	
	showUserIncome(){ 
			this.session.getUserToken().then((token) => {
				if( token['token'] > ''){ 
					let modal = this.modalCtrl.create(IntroductionPage,{ formType: 4 });
					modal.present();	
				}					
			});					  
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
							 else
								this.dialog.showMessage('کد تخفیف با موفقیت ثبت شد');
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
	
}
