import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

declare var cordova: any;

/*
  Generated class for the SettingProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SettingProvider {

	public serverAddress;
	public version;
	public debug;
	public filePath;
  constructor(
				public http: Http ,			
				platform: Platform, 
				file :File) {
	  /*
	if(device.platform == "iOS")
	{
		var path = cordova.file.tempDirectory;
	}
	else if(device.platform == "Android")
	{
		var path = cordova.file.externalRootDirectory;
	}
	  */
//	  	this.filePath = cordova.file.dataDirectory;
	//this.filePath = cordova.file.dataDirectory;

	//this.filePath = cordova.file.externalRootDirectory;
	platform.ready().then(() => {
			var name = null;
			name = cordova.file.externalRootDirectory;
			file.checkDir(name, 'raznameh')
				  .then(_ => {
					console.log('Directory exists');
				  })
				  .catch(err => { 
					console.log('Directory doesnt exist');
					file.createDir(name, 'raznameh', false)
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
		//this.filePath = cordova.file.dataDirectory;
	});
	//this.serverAddress = 'raznameh.com/appv2';
	this.serverAddress = 'demo.mamoshaver.com/appv2';
	this.version = '1.0.3';
	this.debug = true;
    console.log('Hello SettingProvider Provider');
  }

}