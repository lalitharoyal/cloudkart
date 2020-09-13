import { Component } from '@angular/core';
import { NavController, LoadingController ,NavParams, ViewController,PopoverController,App } from 'ionic-angular';

import {Http} from '@angular/http';
import 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import {SimpleGlobal} from 'ng2-simple-global';
@Component({
  selector: 'page-popup-create',
  templateUrl: 'popup-create.html'
})
export class PopupCreatePage {

	tkn_sb:any;
	cards : any;
	myCards : any;
	likedCards : any;
	commentedCards : any;
	sharedCards : any;
	socialCards : any;
	type:any;
	segmentText:any;
  constructor(public navCtrl: NavController, 
  			  private http: Http,
  			  private storage: Storage,public navParams: NavParams,
  			  public sg: SimpleGlobal,public popoverCtrl:PopoverController,
				public loadingCtrl: LoadingController,public app: App,
				public viewCtrl : ViewController) {
  	this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
	});
	this.type = this.navParams.get("type");
	console.log(this.type);
	if(this.type == 'discover'){
		this.segmentText ='Try a new Discovery?';
	}
	else if(this.type == 'tags'){
		this.segmentText = 'Add new Profile #tags?';
	}else if(this.type == 'zones'){
		this.segmentText = 'Create a new Zone?';
	}else if(this.type == 'users')
	this.segmentText ='Invite new members?';
  }

  tagsPages(){	
	//this.viewCtrl.dismiss().then(() => {        
        if(this.type == 'discover'){
			//this.sg['discover'].dismiss();
			/*let popover = this.popoverCtrl.create(PopupCreatediscoverPage ,{}, {cssClass: 'custom-popover'});
				popover.present({ 
			});
			popover.onDidDismiss(data => {				      
			})*/
			let data = 'yes';
			this.viewCtrl.dismiss(data); 
		}
		else if(this.type == 'tags'){
			//this.sg['popover'].dismiss();
			/*let popover = this.popoverCtrl.create(PopupTagsPage, {}, {cssClass: 'custom-popover'});
				popover.present({ 
			});*/
			let data = 'yes';
			this.viewCtrl.dismiss(data); 
		}
		else if(this.type == 'zones'){
			// this.viewCtrl.dismiss()--> for popover to close
			//this.sg['zones'].dismiss();
			let data = 'yes';
			//this.navCtrl.push(CreateZonePage);
			this.viewCtrl.dismiss(data);
		}
		else if(this.type == 'users'){
			//this.sg['users'].dismiss();
			let data = 'yes';
			//this.navCtrl.push(InvitefriendsPage);
			this.viewCtrl.dismiss(data);
		}
       //});	
	
}
	closePopup() {
		let data = 'no';
		this.viewCtrl.dismiss(data)
	
	}	
  }
