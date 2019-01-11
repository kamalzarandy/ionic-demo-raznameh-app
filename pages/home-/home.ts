import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { MediaPlugin } from 'ionic-native';


import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';


import { SessionProvider } from '../../providers/session/session';
import { AlertDialogProvider } from '../../providers/alert-dialog/alert-dialog';


declare var cordova: any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  media1: MediaPlugin = null;
	
 audiofile: MediaObject =  null;

  constructor(public navCtrl: NavController,
              public alertDialog : AlertDialogProvider,
			  public session : SessionProvider,
			  private media: Media, private file: File
			  ) {

  }
ionViewLoaded() {
  }
  

  
  startRecording( num) {
	  var name = null;
	if( num == 1)
		name = 'recording.wav';
	else if( num == 2)
		name = cordova.file.dataDirectory+'recording.wav';
	else if( num == 3)
		name = cordova.file.externalRootDirectory+'recording.wav';
	else if( num == 4)
		name = cordova.file.tempDirectory+'recording.wav';
	  
	  		
	alert(name);
	this.media1 = null;
	this.media1 = new MediaPlugin(name);

	  
	  try {
		this.media1.startRecord();
	  }
	  catch (e) {
		this.alertDialog.showError('Could not start recording.');
	  }
	}

	stopRecording() {
		  try {
			this.media1.stopRecord();
				this.alertDialog.showError('stoped.');
		  }
		  catch (e) {
			this.alertDialog.showError('Could not stop recording.');
		  }
	}

	startPlayback() {
		  try {
			this.media1.play();
			  this.alertDialog.showError('play back.');
		}
		  catch (e) {
			this.alertDialog.showError('Could not play recording.');
		  }
	}

	stopPlayback() {
	  try {
		this.media1.stop();
		  this.alertDialog.showError('stped play back.');
		}
	  catch (e) {
		this.alertDialog.showError('Could not stop playing recording.');
	  }
	}
	
	
	startNew(num){
	  var name = null;
		if( num == 1)
			name = 'recording.mp3';
		else if( num == 2)
			name = cordova.file.dataDirectory+'recording.mp3';
		else if( num == 3)
			name = cordova.file.externalRootDirectory+'/raznameh/recording.mp3';
		else if( num == 4)
			name = cordova.file.tempDirectory+'recording.mp3';
		  
				
		alert(name);
		name = cordova.file.externalRootDirectory+'/raznameh/recording.mp3';		
		this.audiofile  = this.media.create(name)
		this.audiofile.startRecord();
	}
	stopNew(){
		this.audiofile.stopRecord();
	}
		
		playNew(){
			alert(this.audiofile.getDuration());
			this.audiofile.play();
		}

		
		createdirecroty(num){
				  var name = null;
				  name = cordova.file.externalRootDirectory;

			this.file.checkDir(name, 'raznameh')
				  .then(_ => {
					console.log('Directory exists');

				  })
				  .catch(err => { 
					console.log('Directory doesnt exist');
					this.file.createDir(name, 'raznameh', false)
					.then(
					  (files) => {
						// do something
						console.log("success");
					  }
					).catch(
					  (err) => {
						// do something
						console.log("error"); // i am invoking only this part
					  }
					);
				   });
		}
}
