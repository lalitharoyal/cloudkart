import { Component } from '@angular/core';
import { NavController, NavParams ,LoadingController, AlertController, ViewController} from 'ionic-angular';
// import {Http, Headers} from '@angular/http';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import {SimpleGlobal} from 'ng2-simple-global';


@Component({
  selector: 'page-popup-options',
  templateUrl: 'popup-options.html',
})
export class PopupOptionsPage {
  data: any;
  tkn_sb:any;
  zone_id: any;
  muteStatus:boolean=false;
  zoneInfo: any;
  userProfile:any;
  httpOptions = {};

  constructor(public navCtrl: NavController,  
    public sg: SimpleGlobal,
    private storage: Storage, 
    public navParams: NavParams, 
    private http: Http, 
    public loadingCtrl: LoadingController,
    public alertCtrl : AlertController,
    public viewCtrl:ViewController) {
    this.muteStatus = this.navParams.get('zoneStatus');
    this.zoneInfo = this.navParams.get('zone_info');  
  }

  ionViewDidEnter() {
    // this.storage.get('zone_info').then((val) => {
    //   this.zoneInfo = JSON.parse(val);
    //   console.log( this.zoneInfo );
    // });
    this.storage.get('userProfile').then((val) => {
      this.userProfile =val;
      let temp = this.userProfile.id.search("_");
      if(temp > 0) {
      this.userProfile.id = this.userProfile.id.split("_")[0];
      }
      //console.log( this.userProfile );
    });  

    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.tkn_sb })
      };      
    });
    //  this.zoneInfo = this.navParams.get('zone_list');
    //  console.log(this.zoneInfo);
  }

  muteZone(){
    //this.viewCtrl.dismiss();    
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Enabling Mute'      
    });
    loader.present().then(() => { 
      this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/mute',this.httpOptions).map(res => res.json()).subscribe(data => {
        // if(this.zoneInfo.admin.id == this.userProfile.id){
          loader.dismiss();
          this.muteStatus =true;
          this.data = data.data;        
          this.viewCtrl.dismiss(this.muteStatus);           
        //}
      }, err => {
        let data = false;
        this.viewCtrl.dismiss(data);
        loader.dismiss();
        let error = JSON.parse(err._body);
        let alert = this.alertCtrl.create({  
        message: error.error.message,
        buttons: [{
          text: 'OK',
          handler: () => {
          }
        }]
        });
        alert.present();          
      });
    });    
  }
  unmuteZone(){
    //this.viewCtrl.dismiss(); 
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Enabling Unmute'      
    });
    loader.present().then(() => { 
      this.http.get(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/unmute',this.httpOptions).map(res => res.json()).subscribe(data => {
        // if(this.zoneInfo.admin.id == this.userProfile.id){
        loader.dismiss();
        this.muteStatus =false;
        this.data = data.data;
        this.viewCtrl.dismiss(this.muteStatus);
         
        //}   
      }, err => {
        let data = true;
        this.viewCtrl.dismiss(data);
        loader.dismiss(); 
        let error = JSON.parse(err._body);
        let alert = this.alertCtrl.create({  
        message: error.error.message,
        buttons: [{
          text: 'OK',
          handler: () => {
          }
        }]
        });
        alert.present();            
      });
    });
  }

  addMentors(){    
    if(this.zoneInfo.admin.id == this.userProfile.id){
      let data = "mentors";
      this.viewCtrl.dismiss(data);      
    }
    else{
      let data = "";
      this.viewCtrl.dismiss(data);
      let alert = this.alertCtrl.create({
        title: "Alert",
        enableBackdropDismiss:false,
        message: "You are not authorized to add members",
        buttons: ["OK"]
      });
      alert.present();
    }
  }

  addAdmin() {
    if(this.zoneInfo.admin.id == this.userProfile.id){
      let data = "addAdmin";
      this.viewCtrl.dismiss(data);      
    }
    else{
      let data = "";
      this.viewCtrl.dismiss(data);
      let alert = this.alertCtrl.create({
        title: "Alert",
        enableBackdropDismiss:false,
        message: "You are not authorized to add admins",
        buttons: ["OK"]
      });
      alert.present();
    }
  }
  
  exitZone() {
    let data = "exit";
    this.viewCtrl.dismiss(data);
    this.http.post(MyApp.API_ENDPOINT+'/zone/'+this.zoneInfo.id+'/leave',{},this.httpOptions).map(res => res.json()).subscribe(data => {
      let alert = this.alertCtrl.create({
        title : "Alert",
        enableBackdropDismiss:false,               
        message: data.data.message,
          buttons: [{
            text: 'OK',
            handler: () => {
              
            }
          }]
      });
      alert.present();
    }, err => {
      let error = JSON.parse(err._body);        
      let alert = this.alertCtrl.create({
        title : "Alert",
        enableBackdropDismiss:false,               
        message: error.error.message,
          buttons: [{
            text: 'OK',
            handler: () => {
              
            }
          }]
      });
      alert.present();
    });        
  }
  editZone() {
    let data = "edit"
    this.viewCtrl.dismiss(data);     
  }
  isAdmin() {
    if(this.zoneInfo && this.userProfile) {
      for(var i=0; i<this.zoneInfo.admins.length; i++) {
        if(this.zoneInfo.admins[i].role == 'FOUNDER') {
          if(this.userProfile.id == this.zoneInfo.admins[i].user.id) {
            return true;
          }
        }      
      }
      return false;
    }    
  }

  isLeader() {
    if(this.zoneInfo && this.userProfile) {
      for(var i=0; i<this.zoneInfo.leaders_v2.length; i++) {
        if(this.zoneInfo.leaders_v2[i].role == 'LEADER') {
          if(this.userProfile.id == this.zoneInfo.leaders_v2[i].user.id) {
            return true;
          }
        }      
      }
      return false;
    }    
  }
}
