import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform, AlertController, LoadingController, PopoverController, Tabs, App} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
//import { TimelinePage } from '../pages/timeline/timeline';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { Network } from '@ionic-native/network';
import { Firebase } from '@ionic-native/firebase';
import { SimpleGlobal } from 'ng2-simple-global';
import { Storage } from '@ionic/storage';
import { TermsPage } from '../pages/terms/terms';
import { PrivacyPage } from '../pages/privacy/privacy';
import { AboutPage } from '../pages/about/about';
import { MessagesPage } from '../pages/messages/messages';
import { FeedbackPage } from '../pages/feedback/feedback';
import { YourProfilePage } from '../pages/your_profile/your_profile';
import { InviteMembersPage } from '../pages/invite_members/invite_members';
import { PopupMorePage } from '../pages/popup-comingsoon/popup-comingsoon';
import { SocialLoginPage } from '../pages/social_login/social_login';
import { NotificationListPage } from '../pages/notificationList/notificationList';
import { InvitefriendsPage } from '../pages/invitefriends/invitefriends';
import { ChatListPage } from '../pages/chatList/chatList';
import { TabsPage } from '../pages/tabs/tabs';
import { TestPage } from '../pages/test/test';
import { Onboarding_01Page } from '../pages/onboarding-01/onboarding-01';
declare var navigator: any;
declare var Connection: any;
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;  
  userData : any;
  tkn_sb : any;  
  profileStatus : any;
  userProfile : any;  
  httpOptions = {};
  httpReq : any;
  private termsPage;
  private rootPage;
  private myprofilePage;
  private feedbackPage;
  private aboutPage;
  private privacyPage;
  private messagesPage;
  private invitefriendsPage;
  private grouplistPage;
  private notificationSettingsPage;
  private systemMessagesPage;
  private invitePage;
  private zonesPage;
  private searchMessagesPage;
  
    /* ----- forEva production url ----- */    
   //public static API_ENDPOINT='https://xz92q6wbd0.execute-api.us-east-1.amazonaws.com/production';    

    /* -----forEva testing url ----- */      
  public static API_ENDPOINT='https://n0xc2jthna.execute-api.us-east-1.amazonaws.com/dev';
  
  isTimeout: boolean = false;
  alert: any;
  timeIntervalObj: any;
   
  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private alertCtrl: AlertController,
    private mobileAccessibility: MobileAccessibility, 
    private network: Network,
    private http: Http,
    public loadingCtrl: LoadingController,
    public sg: SimpleGlobal, 
    public firebase: Firebase,
    private storage: Storage,
    private appCtrl: App,
    public popoverCtrl: PopoverController) {
      this.termsPage = TermsPage;
      this.myprofilePage = YourProfilePage;
      this.feedbackPage = FeedbackPage;
      this.aboutPage = AboutPage;
      this.privacyPage = PrivacyPage;
      this.messagesPage = MessagesPage;
      this.invitefriendsPage = InviteMembersPage;
      this.systemMessagesPage = NotificationListPage;
      this.invitePage = InvitefriendsPage;      
      this.searchMessagesPage = ChatListPage;
      //this.initializeApp();      
  }
  
  ngOnInit() {
    //alert("Before initialising app");          
    this.initializeApp(); 
    this.rootPage = TestPage;   
  }
 
  initializeApp() {
    //alert("checking platform ready status");   
   /* if (this.platform.is('ios')) {            
      this.firebase.grantPermission();      
      alert("IOS platform status:"+this.platform.is('ios'));          
    }
    else {
      alert("sorry, couldn't read ios platform status :"+this.platform.is('ios'));
    }
    if(this.platform.is('android')) {
            
      alert("Android platform status:"+this.platform.is('android')); 
    }
    else {
      alert("sorry, couldn't read android platform status :"+this.platform.is('android'));
    } */     
    this.platform.ready().then(() => {
      this.rootPage = TestPage;    
      this.handleInternetConnection();    
      this.handleTimeout();
      this.statusBar.show();
      this.statusBar.styleDefault();
      if (this.platform.is('ios')) {            
        this.firebase.grantPermission();
      }
      //alert("before going into storage");     
      this.storage.get('userData').then((val) => {        
        this.userData = val;
        //alert("userdata :"+JSON.stringify(val));              
        if(this.userData && this.userData.token) {        
          //alert("Token :"+this.userData.token);
          this.httpOptions = {
            headers: new Headers({ 'Content-Type': 'application/json','tenaAcceptnt':'application/json', 'token': this.userData.token })
          };                
          this.validationCheck();
          }
          else {
            this.isTimeout = true;
            if(this.alert) {             
              clearTimeout(this.timeIntervalObj);
            }                
            this.appCtrl.getRootNav().setRoot(LoginPage);          
          }        
        });        
        if(this.mobileAccessibility){
          this.mobileAccessibility.usePreferredTextZoom(false);
        }
      });     
  }
  
  getName(username): string{
    let userName = username.split(" ");
    let fname = userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
    if(userName[1]){
      let lname = userName[1].charAt(0).toUpperCase() + userName[1].slice(1);
      return fname+' '+lname;
    }
    else {
      return fname;
    }   
  } 
  getGender(gender): string{
    if(gender){
      return gender.charAt(0).toUpperCase() + gender.slice(1);
    }
  }
  getCity(city): string{
    if(city){
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }
  invite(event) {
    let popover = this.popoverCtrl.create(PopupMorePage);
    popover.present({
      ev: event
    });
  }
  openPage(p) {   
    this.nav.push(p);    
  }
  openZones(page) {
    this.sg['segment'] = "zones";
    this.nav.setRoot(page);
  }
  logout() {           
    this.storage.remove('tokens');
    this.storage.remove('sbtkn');
    this.storage.remove('userData');
    this.storage.remove('userProfile');
    this.storage.remove('profileStatus'); 
    this.appCtrl.getRootNav().setRoot(LoginPage);
    //this.nav.setRoot(LoginPage);       
  } 
  getMemberSince(date):string{
    let user_date:any = new Date(date);
    let today_date:any = new Date();
    let diff_date = today_date - user_date;
    let num_years = diff_date/31536000000;
    let num_months = (diff_date % 31536000000)/2628000000;
    let years = Math.floor(num_years);
    let month = Math.floor(num_months); 
    if(month > 1 && years > 1){
      return years+' '+'yrs,'+' '+month+' '+'months';
    }
    else if(years < 1 && month < 1) {
      return years+' '+'yr,'+' '+month+' '+'month';
    }
    else if(years < 1 && month > 1) {
      return years+' '+'yr,'+' '+month+' '+'months';
    }
    else if(years > 1 && month < 1) {
      return years+' '+'yrs,'+' '+month+' '+'month';
    }
  }

  handleTimeout() {
    this.timeIntervalObj = setTimeout(() => {
      if(!this.isTimeout) {
        //alert("in timeout");
        this.httpReq.unsubscribe();
        this.alert = this.alertCtrl.create({
          title : "Alert!",        
          message: "Ouch, something isn't right. Please check Net connection and retry.",
          enableBackdropDismiss:false,
          buttons: [{
            text: 'OK',
            handler: () => {
              if(this.platform.is('ios')) {                                 
               this.logout();
              }
              if(this.platform.is('android')) { 
                console.log("exit app");                 
                //this.platform.exitApp() ;
                 this.logout();
              }
            }
          }]
        });
        this.alert.present();
      }
      else {
        //alert("out of timeout");
      }          
    },7000); 
  }

  handleInternetConnection() {
    var networkState = navigator.onLine;
    if(networkState) {      
      /*let alert = this.alertCtrl.create({
        title: "Connection Status",
        message: "Back to online:)",
        buttons: [{
          text: 'OK',
          handler: () => {          
            
          }            
        }]
      });
      alert.present();*/
    }
    else {
      //alert("You are offline");
      let alert = this.alertCtrl.create({
        title: "Connection Status",
        message: "You are offline:(",
        buttons: [{
          text: 'RETRY',          
            handler: () => {
              //alert.dismiss();          
              this.validationCheck();
            }
          },{
          text: 'CANCEL',
          handler: () => { }
        }  
        ]
      });
      alert.present();
    }       
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {      
      if(typeof this.sg['internetRetry'] == "undefined" || this.sg['internetRetry'] == "") {
        this.sg['internetRetry'] = this.alertCtrl.create({
          title: "No internet?",
          message: "Connection dropped. Reconnect to WiFi or cellular data please.",
          buttons: [{
            text: 'RETRY',
            handler: () => {          
              this.sg['internetRetry'] = "";
              //this.nav.setRoot(this.nav.getActive().component);
            },
              role: 'cancel'
          }]
        });
        this.sg['internetRetry'].present(); 
      } 
    });
  }

  validationCheck() {
    this.handleInternetConnection();
    this.httpReq = this.http.get(MyApp.API_ENDPOINT+'/user/token/validate', this.httpOptions).map(res => res.json()).subscribe(data => { 
      //alert("Response from token validate api:"+JSON.stringify(data));
      this.isTimeout = true;                     
      if(data.data.user == true){
        //alert("Token :"+this.userData.token);
        this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(res => {
            //alert("Response from profile api:"+JSON.stringify(res));
            let userObj = res.data;                 
            this.sg['myProfileData'] = userObj;
            this.storage.set('userProfile',userObj);
            let social_login = userObj.social_connect;                
            if(social_login.length > 0){
              if(this.alert) {                     
                clearTimeout(this.timeIntervalObj);
              }
              if(userObj.is_profile_complete == true && userObj.is_first_time == false) {                    
                this.rootPage = TabsPage;
              }
              else {                    
                this.rootPage = Onboarding_01Page;
              }                                  
            }
            else {                  
              if(this.alert) {                      
                clearTimeout(this.timeIntervalObj);
              }                  
              this.nav.setRoot(SocialLoginPage);
            }              
          });              
          if(this.alert) {                  
            clearTimeout(this.timeIntervalObj);
          }                                         
        }
        else {
          if(this.alert) {
            
            clearTimeout(this.timeIntervalObj);
          }                          
          this.appCtrl.getRootNav().setRoot(LoginPage);
        }     
      },
      err => {
        this.isTimeout = true;
        let error = JSON.parse(err._body);
        //alert("Error messagefrom token validate api:"+JSON.stringify(error.error.message));
        if(error.status == false){
          this.storage.remove('sbtkn');
          this.storage.remove('profileStatus');
          this.storage.remove('userProfile');
          if(this.alert) {
            
            clearTimeout(this.timeIntervalObj);
          }              
          this.appCtrl.getRootNav().setRoot(LoginPage);          
        }        
      });
  }
}
 
  
  

