import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { siteContent } from '../site-content/site-content'; 
import { consultation } from '../consultation/consultation'; 
import { userProfile } from '../userProfile/userProfile'; 
//import { peopleRelation } from '../peopleRelation/peopleRelation'; 
//2600
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = HomePage;
  tab3Root: any = siteContent;
  tab4Root: any = consultation;
  tab5Root: any = userProfile;
  mySelectedIndex: number;
  constructor(navParams: NavParams) {
    //this.mySelectedIndex = navParams.data.tabIndex || 0;
    this.mySelectedIndex = 3;
	//alert('tabs constructor');
  }
}
