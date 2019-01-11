import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events } from 'ionic-angular';
//import { GoogleAnalytics } from 'ionic-native';
//import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { TabsPage } from '../pages/tabs/tabs';
import { SessionProvider } from '../providers/session/session';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(
			//private ga: GoogleAnalytics,
			platform: Platform, 
			statusBar: StatusBar, 
			public events: Events,
			splashScreen: SplashScreen,
			session : SessionProvider) {
		platform.ready().then(() => {
		  // Okay, so the platform is ready and our plugins are available.
		  // Here you can do any higher level native things you might need.
		  statusBar.styleDefault();
		  splashScreen.hide();
		  
			session.hasLoggedIn().then((hasLoggedIn) => {
			if(hasLoggedIn == true){
				session.createSecondToken();
				this.events.subscribe('user:mustLogin', () => {
					this.rootPage = LoginPage;
				  });				
				this.rootPage = TabsPage;
					
			}
				else
					this.rootPage = LoginPage;
			});	  
		});

			/*

		var trackingId = 'UA-5619447-6';
		if (/(android)/i.test(navigator.userAgent)) { // for android 
		  trackingId = 'UA-554XXXXXX-X';
		} else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
		  trackingId = 'UA-554XXXXX-X';
		}
		//platform is injected in the Constructor
		platform.ready().then(() => {
		  ga.debugMode();
		  ga.startTrackerWithId(trackingId).then(()=> {
			console.log("GoogleAnalytics Initialized with ****** : " + trackingId);
	 
			ga.enableUncaughtExceptionReporting(true)
			  .then((_success) => {
				console.log("GoogleAnalytics enableUncaughtExceptionReporting Enabled.");
			  }).catch((_error) => {
			  console.log("GoogleAnalytics Error enableUncaughtExceptionReporting : " + _error)
			});
		  });
		});
	
	  	 */
  }
}
