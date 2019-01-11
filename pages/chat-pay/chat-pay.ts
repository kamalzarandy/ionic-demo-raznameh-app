import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';
import {  ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { MediaPlugin } from 'ionic-native';
import { Media, MediaObject } from '@ionic-native/media';

import { AlertController } from 'ionic-angular';


import { DialogProvider } from '../../providers/dialog/dialog';
import { SessionProvider } from '../../providers/session/session';
import { SettingProvider } from '../../providers/setting/setting';

import { ConsultationProfilePage } from '../consultation-profile/consultation-profile';
import { MoreQuestionPage } from '../more-question/more-question';
import { PollQuestionPage } from '../poll-question/poll-question';
import { PayPage } from '../pay/pay';


import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

/**
 * Generated class for the ChatPayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-pay',
  templateUrl: 'chat-pay.html',
})
export class ChatPayPage {
	public errorCode: any;
	public errorMessage: any;   	
	public question: any;   	
	public questionId : any ;
	public users : any ;
	public cameType : any ;
	public messages : any ;

	lastImage: string = null;
	loading: Loading;
    public base64Image: any;
    public progressValue: any;
	small_image: any; 
	public token: any;
	recorded: boolean;
	play: boolean;
	media: MediaPlugin = null;
	audiofile: MediaObject =  null;
	audioArray: any[] = []; 
	img: any[] = []; 
	firstImg: any = 'assets/imgs/play-stop.png'; 
	public appDataPath ;
	public fileTransfer: TransferObject = this.transfer.create();
	
  constructor(public setting:SettingProvider,
				public events:Events,
				public session:SessionProvider,
				public http:Http,
				public dialog:DialogProvider,
				public navCtrl: NavController, 
				public modalCtrl: ModalController, 
				public navParams: NavParams,
				public viewCtrl: ViewController,
				
				private camera: Camera,
				private transfer: Transfer, 
				private file: File, 
				private filePath: FilePath, 
				public actionSheetCtrl: ActionSheetController, 
				public toastCtrl: ToastController, 
				public platform: Platform, 
				public loadingCtrl: LoadingController,
				private photoViewer: PhotoViewer,
				public alertCtrl : AlertController,
				public mediaObj: Media,
				) {
	    this.questionId = navParams.get("questionId");					
	    this.cameType = navParams.get("cameType");	
		this.recorded = false;		
		this.play = false;
	platform.ready().then(() => {
	  this.appDataPath = cordova.file.externalRootDirectory+'/raznameh/';		
	});		
		

  }

  ionViewDidLoad() {
	this.platform.ready().then(() => {
		this.loadQuestion();		
	});		
    console.log('ionViewDidLoad ChatPayPage');
  }
   loadQuestion(){
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						this.token = token['token'];
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=questionSpecification&questionId='+this.questionId+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode == 2){
									this.viewCtrl.dismiss();
									let modal = this.modalCtrl.create(PayPage, {payCost: data.cost});
									modal.onDidDismiss(data => { 
									});									
									modal.present();
									this.dialog.showMessage('جهت مشاهده پاسخ می یایست مبلغ '+data.cost+'تومان واریز نماييد');
									
								}else 
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1000);
								}else{
									this.question = data.question;
									this.messages = data.messages;
									for (var item of data.messages) {
										if(item.message_type == 3){
											this.download(item.filePath ,item.file);
											this.img[item.file]='assets/imgs/play-stop.png';
										}
									}
									//this.users = data.users;
								}
								this.dialog.closeLoading();		
							 },error=>{ 
								console.log(error);// Error getting the data
								this.dialog.showError('خطا در دريافت اطلاعات');
								this.dialog.closeLoading();		
							});					
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});
	}	 
	  
  	goToConsultationProfile(item: any) {
			this.navCtrl.push(ConsultationProfilePage, { userTitle: item.lang_far_title ,uid: item.uid});
	}
	
	
	submitPoll(record){
		let modal = this.modalCtrl.create(PollQuestionPage, { questionId: this.questionId });
		modal.onDidDismiss(data => {
			if(data == true)
				this.loadQuestion();
		});		
		modal.present();		
	}
	
	dismiss() {
		this.viewCtrl.dismiss();
	}	
	
	//-----
	submitText(record){
		let modal = this.modalCtrl.create(MoreQuestionPage, { questionId: this.questionId ,questionType : 2 });
		modal.onDidDismiss(data => {
			if(data == true)
				this.loadQuestion();
		});		
		modal.present();		
	}
	
	cancelQuestion(record){
		let prompt = this.alertCtrl.create({
					title: 'آيا از لغو سوال و بازگشت هزينه اطمینان دارید',
					  buttons: [
						{
						  text: 'عدم لغو سوال',
						  handler: data => {
												  
							console.log('Cancel clicked');
						  }
						},
						{
						  text: 'تاييد لغو سوال ',
						  handler: data => {
							 this.callCancelQuestion(record);
						  }
						}
					  ]
					});
					prompt.present();
	}
	callCancelQuestion(record){
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=cancelQuestion&questionId='+this.questionId+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1000);
								}else{
									this.loadQuestion();								
									this.dialog.showMessage('مبلغ '+data.cost+' تومان به حساب شما واریز شد ');
								}
								this.dialog.closeLoading();		
							 },error=>{ 
								console.log(error);// Error getting the data
								this.dialog.showError('خطا در دريافت اطلاعات');
								this.dialog.closeLoading();		
							});					
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});		
	}
	
	sendQuestion(record ,subCash=0){
			this.dialog.createDefaultLoading();
			this.session.getUserToken().then((token) => {
				if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
						var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=sendQuestion&questionId='+this.questionId+'&subCash='+subCash+'&token='+token['token']; 
						this.http.get(url)
						 .map(res => res.json())
						 .subscribe(data => {
								this.errorCode = data.code;
								this.errorMessage = data.message;
								if(this.errorCode == 2){
									let modal = this.modalCtrl.create(PayPage, {payCost: data.cost});
									modal.onDidDismiss(data => { 
									});									
									modal.present();
									this.dialog.showMessage('جهت ارسال سوال برای مشاور می بایست حساب خود را به مبلغ '+data.cost+'تومان شارژ نمایید');
									
								}else if(this.errorCode == 3){
										let prompt = this.alertCtrl.create({
													title: 'جهت ارسال سوال برای مشاور می بایست مبلغ '+data.cost+'تومان از حساب شما برای مشاوره کسر شود',
													  buttons: [
														{
														  text: 'لغو',
														  handler: data => {
																  				  
															console.log('Cancel clicked');
														  }
														},
														{
														  text: 'تایید کسر مبلغ',
														  handler: data => {
															 this.sendQuestion(record ,1);
														  }
														}
													  ]
													});
													prompt.present();  									
								}
								else if(this.errorCode != 1){
									this.dialog.raiseError(this.errorMessage,this.errorCode ,1000);
								}else{
									this.loadQuestion();								
								}
								this.dialog.closeDelayLoading(1500);		
							 },error=>{ 
								console.log(error);// Error getting the data
								this.dialog.showError('خطا در دريافت اطلاعات');
								this.dialog.closeDelayLoading(1500);		
							});					
				}else{
					this.events.publish( 'user:mustLogin' );		
				}
			});		
		
	}
	
	public submitImage() {
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

	private createFileName( type = null ) {
		var d = new Date(),
			n = d.getTime();
		var newFileName = null;
		if(type == 1 )
			newFileName =  this.questionId+n + ".mp3";
		else
			newFileName =  this.questionId+n + ".jpg";
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
			this.dialog.createDefaultLoading();

		  // Destination URL
		  var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=uploadFile&type=2&questionId='+this.questionId+'&token='+this.token; 
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
		 
		  // Use the FileTransfer to upload the image
		  fileTransfer.upload(targetPath, url, options).then(data => {
			 let result = JSON.parse(data.response);
			 this.errorCode = result.code;
			if(result.code != 1){
				this.dialog.raiseError(result.message,result.code ,1000);
			}else{
				this.presentToast('تصوير با موفقیت بارگزاری شد');
				this.loadQuestion();
			}
			this.dialog.closeLoading();		
		  }, err => {
			this.dialog.closeLoading();
			this.presentToast('خطا در بارگزاری تصویر');
		  });

	}	
	
	showImage(item){
		this.photoViewer.show(item.image, '', {share: false});

	}
	

	
	submitSound(){		
		var fileName = this.createFileName(1);
		/*this.media = new MediaPlugin(fileName);
		 try {
			this.media.startRecord();
		  }
		  catch (e) {
				this.dialog.showError('خطا در ضبط صدا');
		  }
		*/
		var name = this.appDataPath+fileName;		
		this.audiofile  = this.mediaObj.create(name)
		this.audiofile.startRecord();

				let prompt = this.alertCtrl.create({
						title: 'در حال ضبط صدا',
						  buttons: [
							{
							  text: 'لغو',
							  handler: data => {
									  try {
										//this.media.stopRecord();
										this.audiofile.stopRecord();
									  }
									  catch (e) {
										this.dialog.showError('خطا در ضبط صدا');
									  }								  
								console.log('Cancel clicked');
							  }
							},
							{
							  text: 'ذخیره',
							  handler: data => {
										this.audiofile.stopRecord();
										this.uploadSound(this.appDataPath ,fileName ,this.audiofile.getDuration());
/*								  
									  try {
										//this.media.stopRecord();
										this.audiofile.stopRecord();
										this.uploadSound(path ,fileName );
										}
									  catch (e) {
											this.dialog.showError('خطا در ضبط صدا');
									  }
									  */
							  }
							}
						  ]
						});
						prompt.present();  
	}

	public uploadSound(path ,name ,len=null) {
		var lenParam = '';
		if(len != null)
			lenParam ='&len='+len;
		  var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=uploadFile&type=3&questionId='+this.questionId+lenParam+'&token='+this.token; 
		  var targetPath = path+name;
		  // File name only
		  var filename = name;
		  var options = {
			fileKey: "file", 
			fileName: filename,
			chunkedMode: false,
			mimeType: "multipart/form-data",
			params : {'fileName': filename}
		  };
		 
		  const fileTransfer: TransferObject = this.transfer.create(); 
			this.dialog.createDefaultLoading();
		 
		  // Use the FileTransfer to upload the image
		  fileTransfer.upload(targetPath, url, options).then(data => {
			 let result = JSON.parse(data.response);
			 this.errorCode = result.code;
			if(result.code != 1){
				this.dialog.raiseError(result.message,result.code ,1000);
			}else{
				this.presentToast('فايل با موفقیت بارگزاری شد');
				this.loadQuestion();
			}
			this.dialog.closeDelayLoading(1500);
		  }, err => {
			this.dialog.closeDelayLoading(1500);
			this.presentToast('خطا در بارگزاری فايل');
		  });
	}
	
	download(url ,filename) {
		this.file.checkFile(this.appDataPath, filename).then(result => {
						
					  }, (error) => {
						this.fileTransfer.download(url, this.appDataPath + filename ).then((entry) => {
								console.log('download complete: ' + entry.toURL());
							  }, (error) => {
						  });			
				  });			
			
			
			
		/*
		this.file.checkFile(this.appDataPath, filename).then(
			function (success) {
				alert('exist='+this.appDataPath+ filename)
				console.log("kml file found");
				console.log(success);
			}, function (error) {
				alert(url+'  |  '+this.appDataPath + filename);
				  this.fileTransfer.download(url, this.appDataPath + filename ).then((entry) => {
						console.log('download complete: ' + entry.toURL());
					  }, (error) => {
				  });
				 console.log("kml file NOT found");
				 console.log(error);
			});	
			*/
	}
	playSound(file){
		
		var fileLocation = this.appDataPath+file;	
		var find = false;
		
		for (var item of this.audioArray) {
			//alert(JSON.stringify(item))
			if(item.name == file ){
				find = true;
				if(item.play == true ){
				    let index = this.audioArray.indexOf(item);	
					this.audioArray[index].play = false;
					this.audioArray[index].obj.stop();
					this.img[item.name] = 'assets/imgs/play-stop.png';
				}else{
				    let index = this.audioArray.indexOf(item);					
					this.audioArray[index].play = true;
					this.audioArray[index].obj.play();
					this.img[item.name] = 'assets/imgs/play-play.png';
					
				}
			}else{
				if(item.play == true ){
				    let index = this.audioArray.indexOf(item);
					this.audioArray[index].play = false;
					this.audioArray[index].obj.stop();
					this.img[item.name] = 'assets/imgs/play-stop.png';					
				}
			}
		}
		if(find == false ){
			let aObj = this.mediaObj.create(fileLocation);
			this.audioArray.push({ name:file ,play:true ,obj:aObj });
			aObj.play();
			this.img[file] = 'assets/imgs/play-play.png';	
		}
/*		
		alert(file);
if(this.audioArray[file] > ''){
		alert('yes');
}else{
	this.audioArray.push({name:file ,play:true ,obj:this.mediaObj.create(fileLocation)});
	alert(JSON.stringify(this.audioArray));
}
*/
/*
		if(this.audioArray[file] <= ''){
			this.audioArray[file].push({play:true ,obj:this.mediaObj.create(fileLocation)});
			this.audioArray[file].obj.play();
			
		}else if(this.audioArray[file].play == true){
			for (var item of this.audioArray) {
				item.mediaObj.stop();
				item.play = false;
			}			
		}else{
			for (var item of this.audioArray) {
				item.mediaObj.stop();
				item.play = false;
			}			
			this.audioArray[file].play = true;
			this.audioArray[file].obj.play();			
		}
	*/	
		/*
		//if(this.audioArray)
		var audiofile  = this.mediaObj.create(fileLocation)
		audiofile.play();
		*/
	}
	
	removeItem( item ){
		let prompt = this.alertCtrl.create({
					title: 'آيا از حذف اطلاعات اطمينان داريد',
					  buttons: [
						{
						  text: 'لغو',
						  handler: data => {
							console.log('Cancel clicked');
						  }
						},
						{
						  text: 'تایید حذف',
						  handler: data => {
								this.dialog.createDefaultLoading();
								this.session.getUserToken().then((token) => {
									if(token['mobile'] > '' && token['pass'] > '' && token['token'] > ''){ 
											var url = 'http://'+this.setting.serverAddress+'/callService.php?Func=payQuestion&Op=deleteMessage&messageId='+item.csm_id+'&token='+token['token']; 
											this.http.get(url)
											 .map(res => res.json())
											 .subscribe(data => {
													this.errorCode = data.code;
													this.errorMessage = data.message;
													if(this.errorCode != 1){
														this.dialog.raiseError(this.errorMessage,this.errorCode ,1000);
													}else{
														let index = this.messages.indexOf(item);
														if(index > -1){
														  this.messages.splice(index, 1);
														  this.loadQuestion();
														}
													}
													this.dialog.closeLoading();		
												 },error=>{ 
													console.log(error);// Error getting the data
													this.dialog.showError('خطا در دريافت اطلاعات');
													this.dialog.closeLoading();		
												});					
									}else{
										this.events.publish( 'user:mustLogin' );		
									}
								});		
						  }
						}
					  ]
					});
					prompt.present();
		
	}
	ionViewWillLeave(){
		for (var item of this.audioArray) { 
			if(item.play == true ){
				let index = this.audioArray.indexOf(item);
				this.audioArray[index].play = false;
				this.audioArray[index].obj.stop();
				this.img[item.name] = 'assets/imgs/play-stop.png';					
			}
		}
	}
}
