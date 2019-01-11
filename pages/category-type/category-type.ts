import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ItemsListPage } from '../items-list/items-list';

/**
 * Generated class for the CategoryTypePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-type',
  templateUrl: 'category-type.html',
})
export class CategoryTypePage {
  public pageTitle : any;
  public cls_id : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
	  	this.pageTitle = navParams.get("title");
	    this.cls_id = navParams.get("cls_id");	  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryTypePage');
  }
	goToItemListPage(categoryType: any) {
		this.navCtrl.push(ItemsListPage, { title: this.pageTitle ,cls_id: this.cls_id ,categoryType: categoryType});
	}
}
