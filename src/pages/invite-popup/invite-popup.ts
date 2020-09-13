import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';
import { BroadcastInvitePopupPage } from '../broadcast-invite-popup/broadcast-invite-popup';


@Component({
  selector: 'page-invite-popup',
  templateUrl: 'invite-popup.html',
})
export class InvitePopupPage {
  zoneInfo: any;

  constructor(public navCtrl: NavController, 
    private navParams: NavParams,
    private viewCtrl : ViewController,
    private popoverCtrl : PopoverController) {
  }

  ionViewDidEnter() {
    this.zoneInfo = this.navParams.get('zone_list');
  }
  
  broadcastInvite() {
    this.viewCtrl.dismiss();
    let popover= this.popoverCtrl.create(BroadcastInvitePopupPage, {"zone_list" :this.zoneInfo}, {cssClass: 'custom-popover4'});
      popover.present({      
    });
  }
  inviteViaEmail() {
    let data = "emailInvite";
    this.viewCtrl.dismiss(data);    
  }
  inviteExstngUsers() {
    let data = "extngUserInvite";
    this.viewCtrl.dismiss(data);    
  }
  closePopup() {
    this.viewCtrl.dismiss();
  }
}
