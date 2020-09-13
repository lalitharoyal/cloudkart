import { Component } from '@angular/core';
import { NavController, NavParams , MenuController,AlertController, Platform, Alert} from 'ionic-angular';
import { SocialLoginPage } from '../social_login/social_login';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';
import 'rxjs/Rx';
import { AppMinimize } from '@ionic-native/app-minimize';
import { LoadingController } from 'ionic-angular';
import {SimpleGlobal} from 'ng2-simple-global';
//import { DomSanitizer } from '@angular/platform-browser';

import { Onboarding_01Page } from '../onboarding-01/onboarding-01';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-invitecode',
  templateUrl: 'invitecode.html'
})
export class InvitecodePage {
  inviteForm : FormGroup;
  inviteCode: any; 
  useremail :  string;
  iCode : any;
  mail:string;
  result : string;
  submitAttempt: boolean = false;
  logged_in : any;
  userProfile : any;
  safeSvg: any;

  constructor(public navCtrl: NavController, fb: FormBuilder,
    public params: NavParams,
    private http: Http,
    private storage: Storage, 
    private menu: MenuController,
    public loadingCtrl: LoadingController, 
    private alertCtrl: AlertController, 
    public platform: Platform,
    //private sanitizer: DomSanitizer,
    public sg: SimpleGlobal,
    private appMinimize: AppMinimize) { 

      this.useremail = params.get("emailid");
      this.iCode = params.get("icode");
      this.inviteForm = fb.group({
        code : ['', Validators.required]              
      });      
      this.platform.registerBackButtonAction(() => {      
        if(this.navCtrl.canGoBack()){
          this.navCtrl.pop();
        }
        else {
          this.appMinimize.minimize();
        }
      });
  }
  
  next() { 
    let social_login:any;
    let firstTimeUser:any;
    let profileStatus:any;
    let profileComplete :any;
    this.submitAttempt = true;
    if(this.inviteForm.valid){
      let loader = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'Logging you into forEva',
        //content: this.safeSvg,
      });
      loader.present().then(() => {       
        let headers = new Headers( );  
          headers.append( 'Content-Type','application/json');
          headers.append( 'Accept', 'application/json');    
        let body = {
          "code"  : this.inviteCode,
          "email" : this.useremail
        }
        let options = new RequestOptions({
          headers: headers
        });
        this.http.post(MyApp.API_ENDPOINT+'/user/register', body, options).map(res => res.json()).subscribe(data => {         
          let something = data.data.token;
          social_login = data.data.social_connect;
          firstTimeUser = data.data.is_first_time;
          profileStatus = data.data.is_profile_complete;        
          this.storage.set('sbtkn',data.data.token);
          this.storage.set('profileStatus',data.data.is_profile_complete);
          this.storage.set('userData',
          {   "token" : data.data.token,
              "profileStatus" : data.data.is_profile_complete             
          });
          if(social_login.length > 0){                       
            if(firstTimeUser == false && profileStatus == true){
              headers.append( 'token', something);
              this.http.get(MyApp.API_ENDPOINT+'/me/profile', options).map(res => res.json()).subscribe(data => {
                loader.dismiss();
                this.sg['myProfileData'] = data.data;              
                this.storage.set('userProfile',data.data);
                this.sg['userProfile'] = data.data;
                this.navCtrl.setRoot(TabsPage);
              },
              err => {
                loader.dismiss();
              });              
            }
            else if(firstTimeUser == true || profileStatus == false){
              loader.dismiss();
              this.navCtrl.setRoot(Onboarding_01Page);
            } 
          }
          else {
            loader.dismiss();
            setTimeout(() => {
              this.navCtrl.setRoot(SocialLoginPage, {something});
            },500)            
          }         
        },
        err => {
          loader.dismiss();
          let error = JSON.parse(err._body);        
          let alert = this.alertCtrl.create({        
            message: JSON.stringify(error.error.message),
            buttons: [{
              text: 'OK',
              handler: () => {}
            }]
          });
          alert.present();
        });
      });
    } 
  }
  getInviteCode() {
    let alert = this.alertCtrl.create({
      title : "No Worries!",
      enableBackdropDismiss : false,        
      message: "Since forEva is invite-only, let us get back to you soon about how we can get you in. Thanks for being patient!",
      buttons: [{
        text: 'OK',
        handler: () => {}
      }]
    });
    alert.present();
  }
}