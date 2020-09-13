import { Component } from '@angular/core';
import { NavController, LoadingController, Platform} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AppMinimize } from '@ionic-native/app-minimize';

import { TabsPage } from '../tabs/tabs';
import { ProfileUserPage } from '../profile_user/profile_user';
import { ZoneTimelinePage } from '../zoneTimeline/zoneTimeline';
import {SimpleGlobal} from 'ng2-simple-global';


@Component({
  selector: 'page-notificationList',
  templateUrl: 'notificationList.html'
})
export class NotificationListPage { 
  profileuser:any;
  tkn_sb :any;
  notifications : any;
  diffDays : number;
  diffMonths : number;
  year : number;
  diffHours : number;
  diffMin : number;
  notificationLength : number ;
  userProfile:any;
  showLoader :boolean = false;

  constructor(public navCtrl: NavController,
    private http: Http,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public sg: SimpleGlobal,
    private firebase: Firebase,
    private appMinimize: AppMinimize,
    public platform: Platform) {

    this.platform.registerBackButtonAction(() => {      
      if(this.navCtrl.canGoBack()){
        this.navCtrl.pop();
      }
      else {
        this.appMinimize.minimize();
      }
    });
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;
      this.initializeItems();
    });
    this.storage.get('userProfile').then((val) => {
      this.userProfile = val;
    });
  }

  initializeItems() {    
    let headers = new Headers();      
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);
    let options = new RequestOptions({
                  headers: headers                    
    });
    this.showLoader = true;
    this.http.get(MyApp.API_ENDPOINT+'/me/notification/list', options).map(res => res.json()).subscribe(data => {
      this.showLoader = false;
      this.notifications = data.data.notifications; 
      this.notificationLength =  this.notifications.length ;
    },err => {
      this.showLoader = false;
    });           
  }

  getDateFormat(date): string{
    let diffMin, diffHours, diffDays, diffMonths, year;
    var currentDate = new Date();
    var res = date.split("T");
    var temp = res[0].split("-");
    var time = res[1].split(":");
    var sec = time[2].split(".");
    var yr = parseInt(temp[0]);
    var mon = parseInt(temp[1]) -1;
    var day = parseInt(temp[2]);
    var hr = parseInt(time[0]);
    var min = parseInt(time[1]);
    var sec1 = parseInt(sec[0]);
    var dt = new Date(yr, mon,day, hr, min, sec1);
    diffDays = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24));
    diffMonths = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24 * 30));
    year = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate())) /(1000 * 60 * 60 * 24 * 365));       
    var timeDiff = (currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000)) - (dt.getTime());  
    diffHours = Math.round(timeDiff / (1000*60*60) ) ;    // hours
    diffMin = Math.round(timeDiff / (1000*60) ) ;        // mins
    
    if(year > 0){      
      return year+'Y';
    }
    else if(diffDays > 6){ 
      let week =  Math.round(diffDays/7);    
      return week+'W';
    }
    else if(diffHours > 23){          
      return diffDays+'D';
    }    
    else if(diffMin > 59 ){     
      return diffHours+'h';       
    }
    else {
      return diffMin+'m';
    }
  } 

  expand(idx, item){
    this.firebase.logEvent("notification_click", {content_type: "card", user_id: this.userProfile.id, notification_type: item.notification_type});    
    if(item.unread == true){      
      let headers = new Headers();        
      headers.append( 'Content-Type','application/json');
      headers.append( 'Accept', 'application/json');
      headers.append( 'token', this.tkn_sb);
      let options = new RequestOptions({
        headers: headers                    
      });      
      this.http.post(MyApp.API_ENDPOINT+'/notification/'+item.id+'/read',{},options).map(res => res.json()).subscribe(data => { 
        this.notifications[idx].unread = data.data.unread ;
        if(item.notification_type == 'zone_invite') {
          let id = item.data.story_id;
          this.navCtrl.push(ZoneTimelinePage, {"id":id});          
        }
        else {
          this.sg['storyId']  =  item.data.story_id; 
          this.sg['token']  =  this.tkn_sb; 
          //this.sg['notification']  =  'notification';
          this.sg['filterBy'] = "NOTIFICATION ALERT";
          this.navCtrl.push(TabsPage, { selectedTab: 0 });
        }                
      }, err => {        
      }); 
    }
    else {      
      if(item.notification_type == 'zone_invite') {
        let id = item.data.story_id;
        this.navCtrl.push(ZoneTimelinePage, {"id":id});
      }
      else {
        this.sg['storyId']  =  item.data.story_id; 
        this.sg['token']  =  this.tkn_sb;
        this.sg['filterBy'] = "NOTIFICATION ALERT";
        this.navCtrl.push(TabsPage, { selectedTab: 0 });
      } 
    }            
  }
  
  profileUser(notification){
    // let id = notification.id;
    //this.navCtrl.push(ProfileUserPage, {id});
  }
}