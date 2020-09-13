import { Component } from '@angular/core';
import { NavController,App,ViewController, NavParams, AlertController, LoadingController} from 'ionic-angular';
import {SimpleGlobal} from 'ng2-simple-global';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-popup-delete',
  templateUrl: 'popup-delete.html'
})
export class PopupDeletePage {

id:any;
idx:any;
tkn_sb: any;
story_id : any;
childIdx : any;
user_id:any;
userProfile:any;

  constructor(public navCtrl: NavController,
              public sg: SimpleGlobal,
              public app: App,
              public viewCtrl : ViewController,
              public navParams: NavParams,
              private http: Http,
              private alertCtrl : AlertController,
              private loadingCtrl:LoadingController,
              public storage : Storage) {

    this.id = navParams.get("feedId");     
    this.idx = navParams.get("idx"); 
    this.story_id = navParams.get("storyId");
    this.user_id = navParams.get("userId");
    let temp = this.user_id.search("_");
    if(temp > 0) {
    this.user_id = this.user_id.split("_")[0];
    }
    this.tkn_sb = navParams.get("token");
    this.childIdx = navParams.get("childIdx");
  }
  ionViewWillEnter() {
    this.storage.get('userProfile').then((val) => {
      this.userProfile = val;
      let temp1 = val.id.search("_");      
      if(temp1 > 0) {
        this.userProfile.id = val.id.split("_")[0];
      }      
    });
  }
  /* ------------------------ deleting card from your feed & Database ---------------------------*/
  deleteCard() {
    let index = this.idx ;
    this.sg['idx']= index ;
   // this.sg['cardHidden'][index] = true;
    this.viewCtrl.dismiss();
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Deleting your card'      
    });
    loader.present().then(() => {    
      let headers = new Headers( );  
        headers.append( 'Content-Type','application/json');
        headers.append( 'Accept', 'application/json');
        headers.append( 'token', this.tkn_sb);    
      let options = new RequestOptions({
        headers: headers                
      });              
      this.http.post(MyApp.API_ENDPOINT+'/story/'+this.story_id+'/delete',{},options).map(res => res.json()).subscribe(data => {
        loader.dismiss();
        this.sg['cardHidden'][index] = true;
        let alert = this.alertCtrl.create({
          title: "Success",
          enableBackdropDismiss:false,
          message: "You deleted this card successfully",
          buttons: [{
            text: 'OK',
            handler: () => {}
          }]
        });
        alert.present();        
      }, err => {
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: "Failure",
          enableBackdropDismiss:false,
          message: "Something went wrong",
          buttons: [{
            text: 'OK',
            handler: () => {}
          }]
        });
        alert.present();
      });
    });   
  }
  /* ------------------------ Removing card from your feed only ---------------------------*/
  removeCard() {
    let index = this.idx ;
    this.sg['idx']= index ;
   // this.sg['cardHidden'][index] = true;
    this.viewCtrl.dismiss();
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Deleting your card'      
    });
    loader.present().then(() => {    
      let headers = new Headers( );  
        headers.append( 'Content-Type','application/json');
        headers.append( 'Accept', 'application/json');
        headers.append( 'token', this.tkn_sb);    
      let options = new RequestOptions({
        headers: headers                
      });              
      this.http.post(MyApp.API_ENDPOINT+'/feed/'+this.id+'/delete',{},options).map(res => res.json()).subscribe(data => {
        loader.dismiss();
        this.sg['cardHidden'][index] = true;
        let alert = this.alertCtrl.create({
          title: "Success",
          enableBackdropDismiss:false,
          message: "You removed this card successfully from your feed",
          buttons: [{
            text: 'OK',
            handler: () => {}
          }]
        });
        alert.present();        
      }, err => {
        loader.dismiss();
        let alert = this.alertCtrl.create({
          title: "Failure",
          enableBackdropDismiss:false,
          message: "Something went wrong",
          buttons: [{
            text: 'OK',
            handler: () => {}
          }]
        });
        alert.present();
      });
    });   
  }

  report() {                   
    let index1 = this.idx ;
    this.sg['idx']= index1 ;
    this.sg['cardHidden'][index1] = true;   
    this.viewCtrl.dismiss();    
   let headers = new Headers( );  
     headers.append( 'Content-Type','application/json');
     headers.append( 'Accept', 'application/json');
     headers.append( 'token', this.tkn_sb);    
    let options = new RequestOptions({
        headers: headers                
    });              
    this.http.post(MyApp.API_ENDPOINT+'/story/'+this.story_id+'/report/abuse',{},options).map(res => res.json())
    .subscribe(data => {
        this.sg['cardHidden'][index1] = true;
        let alert = this.alertCtrl.create({
          title: "Alert",
          message: "Thank you for reporting this",
          buttons: [{
          text: 'OK',
          handler: () => {}
          }]
          });
          alert.present();
    }); 
  }

  notAWoman() {
    
  }
 
}
