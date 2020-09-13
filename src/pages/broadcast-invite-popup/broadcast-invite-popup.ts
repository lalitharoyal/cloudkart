import { Component } from '@angular/core';
import { NavController, NavParams,ViewController, Platform} from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-broadcast-invite-popup',
  templateUrl: 'broadcast-invite-popup.html',
})
export class BroadcastInvitePopupPage {
  zoneInfo: any;
  image: any;
 
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl : ViewController,
    private socialSharing: SocialSharing,
    public platform : Platform) {
  }
  
  ionViewDidEnter() {
    this.zoneInfo = this.navParams.get('zone_list');
  }  
  closePopup() {
    this.viewCtrl.dismiss();
  }
  shareViaWhatsapp(){ 
    this.image = this.zoneInfo.master_invite_attachment.url;
    this.socialSharing.shareViaWhatsApp("Zone invitation from forEva: iOS App-https://itunes.apple.com/in/app/foreva/id1440248223?mt=8 & Android App-https://play.google.com/store/apps/details?id=app.foreva.android", this.image, "")
      .then(()=>{                
      })
      .catch((err)=>{
        alert("Whatsapp not installed in your mobile");
        console.log("error :"+JSON.stringify(err));
      })
  }
  shareViaInsta(){
    this.image = this.zoneInfo.master_invite_attachment.url;
    this.socialSharing.shareViaInstagram("Zone invitation from forEva: iOS App-https://itunes.apple.com/in/app/foreva/id1440248223?mt=8 & Android App-https://play.google.com/store/apps/details?id=app.foreva.android", this.image)
    .then(()=>{
     
    })
    .catch(()=>{
       alert("Instagram app not installed in your mobile")
    })
  }
  shareViaFB(){
    this.image = this.zoneInfo.master_invite_attachment.url;
    if(this.platform.is('ios')) {
      this.socialSharing.shareViaFacebook("Zone invitation from forEva: iOS App-https://itunes.apple.com/in/app/foreva/id1440248223?mt=8 & Android App-https://play.google.com/store/apps/details?id=app.foreva.android", this.image, "")
      .then(()=>{        
             
      })
      .catch(()=>{
        alert("Failed sharing via facebook")
      })
    }
    else {
      this.socialSharing.shareViaFacebook("Zone invitation from forEva: iOS App-https://itunes.apple.com/in/app/foreva/id1440248223?mt=8 & Android App-https://play.google.com/store/apps/details?id=app.foreva.android", this.image, "")
      .then(()=>{         
        
      })
      .catch(()=>{
        alert("Failed sharing via facebook")
      })
    }   
  }
  shareViaTwitter(){
    //this.image = "https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/a3ac7f35-c77c-4c3f-9f01-4a5e1d9a606a1549015505-13-tmp-temp-5bf2a39c352ccf00012905a6-thumbnail-jpeg" 
    this.image = this.zoneInfo.master_invite_attachment.url;   
    this.socialSharing.shareViaTwitter("Zone invitation from forEva: iOS App-https://itunes.apple.com/in/app/foreva/id1440248223?mt=8 & Android App-https://play.google.com/store/apps/details?id=app.foreva.android", this.image, "")
    .then(()=>{
        
    })
    .catch(()=>{
        alert("Twitter app not installed in your mobile")
    })
  }   
}
