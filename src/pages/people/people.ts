import { Component,ViewChild,NgZone} from '@angular/core';
import { NavController, MenuController, AlertController, LoadingController,NavParams, PopoverController, Content} from 'ionic-angular';
import {Http, Headers} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import {SimpleGlobal} from 'ng2-simple-global';
import { Keyboard } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { PopupCreatePage } from '../popup-create/popup-create';
import { YourProfilePage } from '../your_profile/your_profile';
import { InvitefriendsPage } from '../invitefriends/invitefriends';
import { NotificationListPage } from '../notificationList/notificationList';
import { ChatListPage } from '../chatList/chatList';
import { PopupMorePage } from '../popup-comingsoon/popup-comingsoon';
import { MessagesPage } from '../messages/messages';

@Component({
  selector: 'page-people',
  templateUrl: 'people.html',
})
export class PeoplePage {

  @ViewChild(Content) content: Content;
  searchQuery: string = '';
  items: Array<{name: string, picture: string}>;
  name: string = '';
  infinitescrollObj:any;
  selected_item:any;
  tkn_sb : any; user_Profile:any;
  search_story : any;
  id :any;
  type:any;
  search : any;
  pet: string;
  options:Array<{text: string}>;
  httpOptions = {};
  searchInput:any = "";
  users = [];
  hashTags = [];
  discoveries = [];
  discoverPageNumber  = [];
  cardDisabled = [];
  page_users:number=1; 
  page_zones:number=1;
  //pageSize_tags:number=7; 
  page_tags:number=1; 
  page_discover:number=1;
  placeholders: string;
  zones_list: any = [];
  zones = []; 
  discoveriesLength:any;
  zonesLength:any;
  usersLength:any;
  tagsLength:any;
  topUpStatus:boolean = false; createdMode:boolean = false; showLoader:boolean = false;
  userProfile: any;
  end_url: string;

 
  constructor(public navCtrl: NavController, 
    private menu: MenuController, 
    private alertCtrl: AlertController, 
    private http: Http, 
    private storage: Storage, public navParams : NavParams,
    public loadingCtrl: LoadingController,
    public sg: SimpleGlobal,
    public popoverCtrl : PopoverController,
    private keyboard: Keyboard,
    public zone: NgZone,
    private iab: InAppBrowser) {      
      this.storage.get('sbtkn').then((val) => {
        this.tkn_sb = val;
        this.sg['token_zones'] = val;
        this.httpOptions = {
          headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb})
        };
        this.http.get(MyApp.API_ENDPOINT+'/me/profile', this.httpOptions).map(res => res.json()).subscribe(data1 => {
          this.user_Profile = data1.data;            
          let temp1 = (this.user_Profile.id).search("_");
          if(temp1 > 0) {
            this.user_Profile.id = (this.user_Profile.id).split("_")[0];      
          }   
          this.storage.set('userProfile', data1.data);
        });
        this.initialiseItems();        
      });          
      this.placeholders = 'Your search text here...';
      this.end_url = MyApp.API_ENDPOINT; 
  }
  
  searchForItems(ev: any) {    
      this.page_users = 1;     
      setTimeout(() => {
        this.searchForPeople();
      },500);
  }  
  onSearch(){
    this.keyboard.close();
  }
 
  onCancel(ev:any) {
    this.searchForPeople();
  }
  
  userProfilePage(event, item) {
    let avatarStatus = false;
    this.navCtrl.push(YourProfilePage, {"id":item.id, avatarStatus});
  }
 
  initialiseItems() {
    this.searchForPeople();
  }

  /* search people without loader */
  
  searchForPeople() {
    this.showLoader = true;      
    let body = {
      "search_string": this.searchInput,
      "page": 1,
      "page_size": 50,
    }
    this.http.post(MyApp.API_ENDPOINT+'/util/search/people', body, this.httpOptions).map(res => res.json()).subscribe(data => {
      this.showLoader = false;
      this.users = [];
      this.users = data.data.users;
      this.usersLength = this.users.length;         
    }, 
    err => { 
      this.showLoader = false;    
    });
  }

 
  /* ----------------- infinite scroll of discoveries/tags/users/zones --------------------- */
  doInfinite(infiniteScroll) {
    this.page_users = this.page_users+1;      
    let body = {
      "search_string": this.searchInput,
      "page": this.page_users,
      "page_size": 50,
    }
    this.http.post(MyApp.API_ENDPOINT+'/util/search/people', body, this.httpOptions).map(res => res.json()).subscribe(data => {
      for(var i=0;i<data.data.users.length;i++) {
        let id = data.data.users[i].id;
        let temp1 = id.search("_");
        if(temp1 > 0) {
          id = id.split("_")[0];      
        } 
        if(id != this.user_Profile.id){
          this.users.push(data.data.users[i]); 
        }              
      }
      infiniteScroll.complete();
    }, err => {       
      infiniteScroll.complete();
    });
  }   
  createButton(){
    let popover = this.popoverCtrl.create(PopupCreatePage ,{"type":"users"});
      popover.present({        
    });
    popover.onDidDismiss(data => {
      if(data == "yes") {        
        this.navCtrl.push(InvitefriendsPage);
      }          
    }); 
  }


  onScroll($event) {  
    this.zone.run(() => {
      if ($event.scrollTop > 1 && this.createdMode == false){
        this.topUpStatus = true;
      }else{
      this.topUpStatus = false;
      }
    })
  }
  scrollToTop($event) {
    this.content.scrollToTop();
    this.topUpStatus = false;
    // this.animation =  true;    
  }
  notifications(count) {
    //this.stories = []; 
    this.navCtrl.push(NotificationListPage); 
    if(count > 0){        
      this.http.get(MyApp.API_ENDPOINT+'/me/notification/new/clear', this.httpOptions).map(res => res.json()).subscribe(data => {
        this.sg['myProfileData'].new_notification_count = data.new_notification_count ;
      }); 
    }
  }
  myProfilePage() {
    this.navCtrl.push(YourProfilePage);               
  }
  
  chatList() {
    this.navCtrl.push(ChatListPage);
  }
  searchItems() {
    let popover= this.popoverCtrl.create(PopupMorePage);
      popover.present({      
    });
  }
  addMember() {
    let popover= this.popoverCtrl.create(PopupMorePage);
      popover.present({      
    });
  }
  startChat(id,name){
    let loader = this.loadingCtrl.create({
      content: 'Loading',
    });
    loader.present().then(() => {
      let body = {
        "to_user": id
      }
      this.http.post(MyApp.API_ENDPOINT+'/get/chat/user',body,this.httpOptions).map(res => res.json()).subscribe(data => {
        let chatId = data.data.id;
        let webChatId = data.data.chat_websocket_channel;
        loader.dismiss();
        this.navCtrl.push(MessagesPage, {id,name,chatId,webChatId});
      },
      err => {
        loader.dismiss();
      });              
    }); 
  }
}
