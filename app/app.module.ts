import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
//import {SocialSharing} from 'ionic-native';
//import { GoogleAnalytics } from '@ionic-native/google-analytics';

import { SocialSharing } from '@ionic-native/social-sharing';


import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PhotoViewer } from '@ionic-native/photo-viewer';


//import { LocalNotifications } from '@ionic-native/local-notifications';

//import { File } from '@ionic-native/file';
//import { Transfer } from '@ionic-native/transfer';
//import { FilePath } from '@ionic-native/file-path';
//import { Camera } from '@ionic-native/camera';
//the last is 2800 

import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Media } from '@ionic-native/media';



import { ItemsListPage } from '../pages/items-list/items-list';
import { ConsultationListPage } from '../pages/consultation-list/consultation-list';
import { ConsultationProfilePage } from '../pages/consultation-profile/consultation-profile';
import { ChatPage } from '../pages/chat/chat';
import { siteContent } from '../pages/site-content/site-content';
import { consultation } from '../pages/consultation/consultation';
import { userProfile } from '../pages/userProfile/userProfile';
import { peopleRelation } from '../pages/peopleRelation/peopleRelation';
import { ChatProvider } from '../providers/chat/chat';
import { AlertDialogProvider } from '../providers/alert-dialog/alert-dialog';
import { LoginPage } from '../pages/login/login';
import { LoginValidatePage } from '../pages/login-validate/login-validate';
import { ViewItemPage } from '../pages/view-item/view-item';
import { CategoryTypePage } from '../pages/category-type/category-type';
import { ConsultationActivityPage } from '../pages/consultation-activity/consultation-activity';
import { MoreQuestionPage } from '../pages/more-question/more-question';
import { PollQuestionPage } from '../pages/poll-question/poll-question';
import { MakeFreeQuestionPage } from '../pages/make-free-question/make-free-question';
import { MakeQuestionWarningPage } from '../pages/make-question-warning/make-question-warning';
import { IntroductionPage } from '../pages/introduction/introduction';
import { MakeconsultationPage } from '../pages/makeconsultation/makeconsultation';
import { Makeconsultation2Page } from '../pages/makeconsultation2/makeconsultation2';
import { NotificationPage } from '../pages/notification/notification';

import { BillListPage } from '../pages/bill-list/bill-list';
import { PayPage } from '../pages/pay/pay';
import { ChatPayPage } from '../pages/chat-pay/chat-pay';


import { SessionProvider } from '../providers/session/session';
import { LoadingDialogProvider } from '../providers/loading-dialog/loading-dialog';
import { DialogProvider } from '../providers/dialog/dialog';
import { SettingProvider } from '../providers/setting/setting';
import { ConversionProvider } from '../providers/conversion/conversion';


@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
	ItemsListPage,
	ConsultationListPage,
	ConsultationProfilePage,
	ChatPage,
	siteContent,
	consultation,
	userProfile,
	peopleRelation,
	LoginPage,
	LoginValidatePage,
	ViewItemPage,
	ConsultationActivityPage,
	MoreQuestionPage,
	PollQuestionPage,
	MakeFreeQuestionPage,
	MakeQuestionWarningPage,
	IntroductionPage,
	BillListPage,
	PayPage,
	MakeconsultationPage,
	Makeconsultation2Page,
	ChatPayPage,
	NotificationPage,
	CategoryTypePage  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsHideOnSubPages: true}),
	HttpModule,
    IonicStorageModule.forRoot()

  ],
  bootstrap: [
  IonicApp
  ],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
	ItemsListPage,
	ConsultationListPage,
	ConsultationProfilePage,
	siteContent,
	consultation,
	userProfile,
	peopleRelation,
	LoginPage,
	LoginValidatePage,
	ViewItemPage,
	CategoryTypePage,
	ChatPage,
	MoreQuestionPage,
	PollQuestionPage,
	ConsultationActivityPage,
	MakeFreeQuestionPage,
	MakeQuestionWarningPage,
	BillListPage,
	PayPage,
	MakeconsultationPage,
	Makeconsultation2Page,
	ChatPayPage,
	NotificationPage,
	IntroductionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SessionProvider,
    ChatProvider,
    AlertDialogProvider,
    LoadingDialogProvider,
    DialogProvider,
    SettingProvider,
    ConversionProvider,
	SocialSharing,
    File,
    Transfer,
    Camera,
    FilePath,
InAppBrowser,	
PhotoViewer,
Media, 
	//GoogleAnalytics,
//	LocalNotifications,
//	File,
//    Transfer,
//    Camera,
//    FilePath,
  ]
})
export class AppModule {}
