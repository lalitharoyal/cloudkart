import { Component } from '@angular/core';
import { NavController , NavParams, Platform,MenuController, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from '../../app/app.component';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
// import { WelcomePage } from '../welcome/welcome';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { AppMinimize } from '@ionic-native/app-minimize';
import { LoadingController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
//import { DomSanitizer } from '@angular/platform-browser';
import { Firebase } from '@ionic-native/firebase';
import { Onboarding_01Page } from '../onboarding-01/onboarding-01';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-social_login',
  templateUrl: 'social_login.html'
})

export class SocialLoginPage {
  result : any[];
  token_sl : string;
  accesstkn : string;
  userData: any;
  svg : any;
  safeSvg : any;
  userId:any;
  param:any ={};
  
  constructor(public navCtrl: NavController,
              private http: Http, 
              public params: NavParams,
              private storage: Storage, 
              private fb: Facebook, 
              public loadingCtrl: LoadingController,
              private googlePlus: GooglePlus,
              public platform: Platform,
              private menu: MenuController,
              private alertCtrl: AlertController,
             // private sanitizer: DomSanitizer,
              private firebase: Firebase,
              private appMinimize: AppMinimize) {
  
      this.storage.get('sbtkn').then((val) => {
        this.token_sl = val;     
      });
      this.storage.get('userProfile').then((val) => {
        if(val) {
          this.userId = val.id;
        }           
    });
    this.param = {
      "user_id" : null,
      "platform": null,
      "error_message":null
    };
    this.platform.registerBackButtonAction(() => {      
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
      }
      else {
        this.appMinimize.minimize();
      }
    });
  } 

  login() { 
    this.fb.login(['email', 'public_profile', 'user_hometown', 'user_birthday'])
      .then((res: FacebookLoginResponse) => {
        this.accesstkn = res.authResponse.accessToken;
        this.getaccessToken(this.accesstkn);
      })
      .catch(e => {
        /*let errMsg = JSON.stringify(e);
        let paramtemp:any = {};
        paramtemp["user_id"] = this.userId;
        paramtemp["platform"] = "facebook";
        paramtemp["error_message"] = errMsg;
        this.firebase.logEvent("social_login_failure",paramtemp);
        //alert("Alert: You cancelled the login. Sorry to see you go.");
        let alert = this.alertCtrl.create({
          title: 'Oops, login failed!',
          subTitle: "We respect your choice to not share your social data.<br/><br/>However, since we use this data to ensure age and gender integrity of our users, we have to say bye for now.<br/><br/>Sorry to see you go. Hope you'll be back soon. Take care!",
          buttons: [{
            text: 'OK',
            handler: () => {              
              this.navCtrl.setRoot(LoginPage);
            }
          }]
        });
        alert.present();
        alert.onDidDismiss(data => {
          this.navCtrl.setRoot(LoginPage);
        });*/
      });
      this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
    }

  getaccessToken(accesstkn) {
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging you into forEva'
      //content: 'this.safeSvg'
    });
    loader.present().then(() => {
      let headers = new Headers();  
        headers.append( 'Content-Type','application/json');
        headers.append( 'token', this.token_sl);
        headers.append( 'Accept', 'application/json');    
      let body = {
          "access_token" : accesstkn
      }
      let options = new RequestOptions({
        headers: headers                
      });
      this.http.post(MyApp.API_ENDPOINT+'/user/social/connect/facebook', body, options).map(res => res.json()).subscribe(data => {
        let sbtkn = this.token_sl;             
        loader.dismiss();
        this.navCtrl.setRoot(Onboarding_01Page);
      },
      err => {
        loader.dismiss();
          let error = JSON.parse(err._body);        
          let alert = this.alertCtrl.create({                 
            message: error.error.message,
              buttons: [{
                text: 'OK',
                handler: () => {
                  //this.platform.exitApp();
                }
              }]
          });
        alert.present();
        alert.onDidDismiss(data => {
          //this.platform.exitApp();
        }); 
      });
    });
  }

  googleLogin() {
    let sbtkn = this.token_sl;
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Logging you into forEva'
      //content: 'this.safeSvg'
    });
    loader.present().then(() => { 
      let headers = new Headers();  
        headers.append( 'Content-Type','application/json');
        headers.append( 'token', this.token_sl);
        headers.append( 'Accept', 'application/json');
      let options = new RequestOptions({
                    headers: headers                
      });
      if (this.platform.is('ios')) {
        this.googlePlus.login({
          'scopes': 'profile email https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
        })
        .then(res => {
        //alert("ios response :"+JSON.stringify(res));
          let googleToken = res.accessToken;
          let body = {
            "access_token" : googleToken 
          }
          this.http.post(MyApp.API_ENDPOINT+'/user/social/connect/google',body, options).map(res => res.json()).subscribe(data => {
            loader.dismiss();
            this.navCtrl.setRoot(Onboarding_01Page);
          },
          err => {
            loader.dismiss();
             let error = JSON.parse(err._body);        
             let alert = this.alertCtrl.create({
                //title: "Oops!!! Login Failed",        
                message: error.error.message,
                buttons: [{
                  text: 'OK',
                  handler: () => {              
                    //this.platform.exitApp();
                  }
                }]
              });
              alert.present();
              alert.onDidDismiss(data => {
                //this.platform.exitApp();
              })
          });
        })
        .catch(err => {
          loader.dismiss();
          /*let errMsg = JSON.stringify(err);      
          loader.dismiss();
          let paramtemp:any = {};
            paramtemp["user_id"] = this.userId;
            paramtemp["platform"] = "google";
            paramtemp["error_message"] = errMsg;
          this.firebase.logEvent("social_login_failure",paramtemp);          
          let alert = this.alertCtrl.create({
            title: 'Oops, login failed!',
            subTitle: "We respect your choice to not share your social data.<br/><br/>However, since we use this data to ensure age and gender integrity of our users, we have to say bye for now.<br/><br/>Sorry to see you go. Hope you'll be back soon. Take care!<br/>Error code:"+JSON.stringify(err),
            buttons: [{
              text: 'OK',
              handler: () => {              
                this.navCtrl.setRoot(LoginPage);
              }
            }]
          });
          alert.present();
          alert.onDidDismiss(data => {
            this.navCtrl.setRoot(LoginPage);
          })*/
        })
      }
      else if (this.platform.is('android')) {
        this.googlePlus.login({
          'scopes': 'profile email https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',  
          'webClientId': '956083389157-ap40dbr0svprbtq4okjafghokaai7c3q.apps.googleusercontent.com',
          'offline': false
        })
        .then(res => {
          //alert("android response :"+JSON.stringify(res));
          let googleToken = res.accessToken;
          let body = {
            "access_token" : googleToken 
          }
          this.http.post(MyApp.API_ENDPOINT+'/user/social/connect/google',body, options).map(res => res.json()).subscribe(data => {
            loader.dismiss();
            this.navCtrl.setRoot(Onboarding_01Page);
          },
          err => {
            loader.dismiss();
              let error = JSON.parse(err._body);        
              let alert = this.alertCtrl.create({
                //title: "Oops!!! Login Failed",        
                message: error.error.message,
                  buttons: [{
                    text: 'OK',
                    handler: () => {
                      //this.navCtrl.setRoot(LoginPage);
                    }
                  }]
              });
              alert.present();
              alert.onDidDismiss(data => {
                //this.navCtrl.setRoot(LoginPage);
              }) 
            });
          })
        .catch(err => {
          loader.dismiss();
          //alert("Plugin failure :"+JSON.stringify(err));
          /*let errMsg = JSON.stringify(err);
          loader.dismiss();
          let paramtemp:any = {};
            paramtemp["user_id"] = this.userId;
            paramtemp["platform"] = "google";
            paramtemp["error_message"] = errMsg;
          this.firebase.logEvent("social_login_failure",paramtemp);
          //alert("Alert: You cancelled the login. Sorry to see you go.");
          let alert = this.alertCtrl.create({
            title: 'Oops, login failed!',
            subTitle: "We respect your choice to not share your social data.<br/><br/>However, since we use this data to ensure age and gender integrity of our users, we have to say bye for now.<br/><br/>Sorry to see you go. Hope you'll be back soon. Take care!",
            buttons: [{
              text: 'OK',
              handler: () => {              
                this.navCtrl.setRoot(LoginPage);
              }
            }]
          });
          alert.present();
          alert.onDidDismiss(data => {
            this.navCtrl.setRoot(LoginPage);
          })*/
        }) 
      }  
    });
  }
  ionViewDidEnter() {
    this.menu.swipeEnable(false, 'menu1');
  }
}
