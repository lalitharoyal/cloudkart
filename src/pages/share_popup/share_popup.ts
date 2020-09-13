import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import {SimpleGlobal} from 'ng2-simple-global';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-share_popup',
  templateUrl: 'share_popup.html'
})
export class SharepopupPage {

  permalink:any;
  tkn_sb : any;
  story_id : any;

  constructor( public navCtrl: NavController,
               private socialSharing: SocialSharing,
               public navParams: NavParams,
               public sg: SimpleGlobal,
               private storage: Storage,
               private http: Http,
               public platform: Platform, ) {  
            this.permalink = navParams.get("permalink");
            this.tkn_sb = navParams.get("token");
            this.story_id = navParams.get("storyId");
  }

   mail(){
     if(typeof this.sg['popover'] != "undefined" && this.sg['popover'] != ""){
      this.sg['popover'].dismiss();
    }
    this.socialSharing.shareViaEmail("Shared via Email from forEva:"+this.permalink+'&campaign=gmail', 'Subject', ['recipient@example.org']).then(() => {
        this.shareIncrement('email');
    })
    .catch(() => {
      alert("Email app not installed in your mobile");
    })
  }

  whatsapp(){
      if(typeof this.sg['popover'] != "undefined" && this.sg['popover'] != ""){
        this.sg['popover'].dismiss();
      }
    this.socialSharing.shareViaWhatsApp("Shared via WhatsApp from forEva:"+this.permalink+'&campaign=whatsapp', null /*Image*/,  "" )
      .then(()=>{
        this.shareIncrement('whatsapp');
      })
      .catch((err)=>{
         alert("Whatsapp not installed in your mobile");
         console.log("error :"+JSON.stringify(err)); 
         //this.shareIncrement();                
      })
  }

  twitter(){
    if(typeof this.sg['popover'] != "undefined" && this.sg['popover'] != ""){
      this.sg['popover'].dismiss();
    }
    this.socialSharing.shareViaTwitter("Shared via Twitter from forEva:"+this.permalink+'&campaign=twitter', null /*Image*/,  "")
      .then(()=>{
          this.shareIncrement('twitter');
        })
        .catch(()=>{
           alert("Twitter app not installed in your mobile")
        })
  }

  facebook(){  
    if(typeof this.sg['popover'] != "undefined" && this.sg['popover'] != ""){
      this.sg['popover'].dismiss();
    }
     if(this.platform.is('ios')) {       
       // let msg = "Sharing message via facebook";
       // let img = "https://images.way2college.com/way2college-logo.jpg";
       // let url = "https://www.google.com";
        this.socialSharing.shareViaFacebook("Shared via Facebook from forEva:"+this.permalink+'&campaign=facebook',null,null)
        .then(()=>{         
             // alert("Yes you can share via facebook");
              this.shareIncrement('facebook');
          })
            .catch(()=>{
               alert("Failed sharing via facebook")
        })
      }

     else if (this.platform.is('android')) {
      this.socialSharing.shareViaFacebook("Shared via Facebook from forEva:"+this.permalink+'&campaign=facebook', null /*Image*/,  "")
      .then(()=>{         
          this.shareIncrement('facebook');
        })
        .catch(()=>{
           alert("Facebook app not installed in your mobile")
        })
     }   
  }

  instagram(){      

        if(typeof this.sg['popover'] != "undefined" && this.sg['popover'] != ""){
      this.sg['popover'].dismiss();
    }

        this.socialSharing.shareViaInstagram("Shared via Instagram from forEva:"+this.permalink+'&campaign=instagram',"")
      .then(()=>{
         this.shareIncrement('instagram');
        })
        .catch(()=>{
           alert("Instagram app not installed in your mobile")
        })
  }

  hangouts(){

      if(typeof this.sg['popover'] != "undefined" && this.sg['popover'] != ""){
      this.sg['popover'].dismiss();
    }    
     this.socialSharing.shareVia("Shared via Hangouts from forEva:"+this.permalink+'&campaign=hangouts',"")
      .then(()=>{
          this.shareIncrement('hangouts');
        })
        .catch(()=>{
           alert("Hangouts app not installed in your mobile")
        })
  }

  shareIncrement(campaign){
    let headers = new Headers( );  
         headers.append( 'Content-Type','application/json');
         headers.append( 'Accept', 'application/json');
         headers.append( 'token', this.tkn_sb);    
        let options = new RequestOptions({
            headers: headers                
        });              
        this.http.post(MyApp.API_ENDPOINT+'/story/'+this.story_id+'/share/count/increment',{"channel" : campaign},options).map(res => res.json())
        .subscribe(data => {
            
        });
  }


 
}
