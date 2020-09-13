import { Component,ViewChild,NgZone} from '@angular/core';
import { NavController, MenuController, AlertController, LoadingController,NavParams, PopoverController, Content} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/Rx';
import { MyApp } from '../../app/app.component';
import { Storage } from '@ionic/storage';
import {SimpleGlobal} from 'ng2-simple-global';
import { Keyboard } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { PopupCreatePage } from '../popup-create/popup-create';
import { TabsPage } from '../tabs/tabs';
import { PopupTagsPage } from '../popup-tags/popup-tags';
import { NotificationListPage } from '../notificationList/notificationList';
import { YourProfilePage } from '../your_profile/your_profile';
import { ChatListPage } from '../chatList/chatList';
import { MessagesPage } from '../messages/messages';
import { PopupMorePage } from '../popup-comingsoon/popup-comingsoon';


@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html',
})
export class TagsPage {
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
  segmentType : any = "discover";
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
      
      this.end_url = MyApp.API_ENDPOINT;
      this.initialiseItems(); 
  }

  /*ionViewDidEnter() {
    this.storage.get('userProfile').then((val) => {      
      this.sg['myProfileData'] = val;
      console.log(this.sg['myProfileData']);
    });
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;        
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb})
      };                                   
    });
  }*/

  initialiseItems() {
    this.storage.get('userProfile').then((val) => {      
      this.sg['myProfileData'] = val;
      console.log(this.sg['myProfileData']);
    });
    this.storage.get('sbtkn').then((val) => {
      this.tkn_sb = val;        
      this.httpOptions = {
        headers: new Headers({ 'Content-Type': 'application/json','Accept':'application/json', 'token': this.tkn_sb})
      };
      this.searchForTags();                                   
    });    
  } 
  searchForItems(ev: any) {
    this.page_tags = 1;     
    setTimeout(() => {
      this.searchForTags();
    },500);
  }  
  onSearch(){
    this.keyboard.close();
  }  
  onCancel(ev:any) {
    this.searchForTags();
  }
  /* hashtags without loader*/
  searchForTags() {
    this.showLoader = true;  
    let body = {
      "search_string": this.searchInput,
      "page": 1,
      "page_size": 50,
    }
    this.http.post(MyApp.API_ENDPOINT+'/util/search/hashtags', body, this.httpOptions).map(res => res.json()).subscribe(data => {
      this.showLoader = false;
      //this.sg['hashTags'] = data.data;
      this.hashTags = data.data;
      this.tagsLength = this.hashTags.length;  
    }, err => {
      this.showLoader = false;    
    });
  }
  isMyHashtag(value) {
    value = value.trim(" ");    
    if(this.sg['myProfileData']) {
      for(var i=0;i<this.sg['myProfileData'].hashtags.length;i++) {
        this.sg['myProfileData'].hashtags[i] = this.sg['myProfileData'].hashtags[i].trim(" ");        
        if(this.sg['myProfileData'].hashtags[i].toLowerCase() == value.toLowerCase()) {
          return true;
        }        
      }
    }
  }

  filterByHashtag(hashtag, isMyHashtagStatus) {
    //this.sg['filterbyhashtag_zonestimeline'] = 'filterbyhashtagZonestimeline';
    //this.sg['filterbyhashtagZones'] = 'filterbyhashtag_zones';
    // this.sg['hashtag'] =  hashtag;
    // this.sg['token'] = this.tkn_sb;
    if(typeof isMyHashtagStatus != 'undefined'){
      this.sg['isMyHashtagStatus'] = isMyHashtagStatus;
    }
    this.sg['filterBy'] = hashtag;
    let loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Getting matched cards'      
    });
    loader.present().then(() => { 
      this.http.get(MyApp.API_ENDPOINT+'/util/hashtags/feed?hashtag='+hashtag, this.httpOptions).map(resp => resp.json()).subscribe(data => {
        loader.dismiss();
        this.sg['filteredStories'] = data.data.stories;
        this.navCtrl.push(TabsPage, { selectedTab: 0 });
      });
    }, err => {
      loader.dismiss();
    });  
    
  } 
  
  /* ----------------- infinite scroll of discoveries/tags/users/zones --------------------- */
  doInfinite(infiniteScroll) {
    this.page_tags = this.page_tags+1;
    let body = {
      "search_string": this.searchInput,
      "page": this.page_tags,
      "page_size": 50,
    }     
    this.http.post(MyApp.API_ENDPOINT+'/util/search/hashtags', body, this.httpOptions).map(res => res.json()).subscribe(data => {        
      for(var i=0;i<data.data.length;i++) {          
        this.hashTags.push(data.data[i]);
        //this.sg['hashTags'].push(data.data[i]);         
      }
      infiniteScroll.complete();            
    }, 
    err => {
      infiniteScroll.complete();
    });
  }
  createButton(){
    let popover  = this.popoverCtrl.create(PopupCreatePage ,{"type":"tags"});
      popover.present({
    });
    popover.onDidDismiss(data => {
      if(data == "yes") {
        let popover1 = this.popoverCtrl.create(PopupTagsPage ,{"type":"tags"});
          popover1.present({        
        });
        popover1.onDidDismiss(data1 => {
          if(data1 == "yes") {
            this.searchForTags();
          }          
        });
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

