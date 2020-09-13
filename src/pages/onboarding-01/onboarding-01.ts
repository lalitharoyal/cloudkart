import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {SimpleGlobal} from 'ng2-simple-global';
import { AppMinimize } from '@ionic-native/app-minimize';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { Onboarding2Page }from '../onboarding2/onboarding2';

@Component({
  selector: 'page-onboarding-01',
  templateUrl: 'onboarding-01.html',
})
export class Onboarding_01Page {
  httpOptions: { headers: Headers; };
  userProfile: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage, 
    private http: Http,
    public sg: SimpleGlobal) {
  }

  ionViewDidEnter() {    
    this.storage.get('sbtkn').then((val) => {      
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': val })
      };
      if(!this.sg['userObj']) {
        this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(res => {        
          this.sg['userObj'] = res.data;
          if(!this.sg['userObj'].avatar_image || !this.sg['userObj'].avatar_image.url) {
            this.sg['userObj'].avatar_image = {
              'url' : 'https://s3-ap-southeast-1.amazonaws.com/streetbuzz-static-files/masks/2015-11-06benatky-maska-10-radynacestu-pavel-spurek-2015.jpg'
            }
          }        
        });
      }
      if(!this.sg['interests']) {
        this.http.get(MyApp.API_ENDPOINT+'/user/preferences/default/get', this.httpOptions).map(res => res.json()).subscribe(data => {
          let list = data.data.preferences;
          this.sg['categories'] = list;
          this.sg['interests'] = [];
          this.sg['myInterests'] = [];
          for(var i=0;i<list.length;i++) {
            if(list[i].set == true) {
              this.sg['interests'].push(list[i].category.name);
              //this.sg['myInterests'].push(list[i].category.name);
            }
          }       
        });
      }            
    });
  }
 
  spittingMethod(username): string{
    if(username){
      let userName = username.split(" ");    
      return userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
    }
    else {
      return 'User';
    }   
  } 
  goNext(){
    this.navCtrl.setRoot(Onboarding2Page);
  }
}
